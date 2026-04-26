import { del, get, list, put } from "@vercel/blob";
import { z } from "zod";
import {
  postFrontmatterSchema,
  postSchema,
  postsManifestSchema,
  sortPostsByDateDesc,
  type Post,
  type PostFrontmatter,
  type PostSummary,
} from "../../content/posts.ts";

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

type FrontmatterParseResult = {
  data: Record<string, unknown>;
  content: string;
};

const pageIndexEntrySchema = z.object({
  pageId: z.string().trim().min(1),
  slug: z.string().trim().min(1),
});

type PageIndexEntry = z.infer<typeof pageIndexEntrySchema>;
type BlobTextKind = "markdown" | "json";

type BlobTextReadOptions = {
  kind: BlobTextKind;
};

type BlobGetResponse = NonNullable<Awaited<ReturnType<typeof get>>>;
type BlobClient = {
  del: typeof del;
  get: typeof get;
  list: typeof list;
  put: typeof put;
};

const defaultBlobClient: BlobClient = {
  del,
  get,
  list,
  put,
};

let blobClient: BlobClient = defaultBlobClient;

export function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.NOTION_SYNC_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  return token;
}

export function setBlobClientForTesting(client: Partial<BlobClient> | null): void {
  blobClient = client ? { ...defaultBlobClient, ...client } : defaultBlobClient;
}

export function getNotionToken(): string {
  const token = process.env.NOTION_SECRET;

  if (!token) {
    throw new Error("NOTION_SECRET is not configured");
  }

  return token;
}

export function getNotionDataSourceId(): string {
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID ?? process.env.NOTION_DATABASE_ID;

  if (!dataSourceId) {
    throw new Error("NOTION_DATA_SOURCE_ID is not configured");
  }

  return dataSourceId;
}

export function getSyncTriggerSecret(): string {
  const secret = process.env.NOTION_SYNC_TRIGGER_SECRET;

  if (!secret) {
    throw new Error("NOTION_SYNC_TRIGGER_SECRET is not configured");
  }

  return secret;
}

export function getWebhookVerificationToken(): string {
  const token = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;

  if (!token) {
    throw new Error("NOTION_WEBHOOK_VERIFICATION_TOKEN is not configured");
  }

  return token;
}

export function getPostPath(slug: string): string {
  return `posts/${slug}.md`;
}

export function getPostsManifestPath(): string {
  return "posts/index.json";
}

export function normalizeNotionPageId(pageId: string): string {
  return String(pageId).toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getPageIndexPath(pageId: string): string {
  return `page-index/${normalizeNotionPageId(pageId)}.json`;
}

function parseFrontmatterValue(rawValue: string): unknown {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
    try {
      const parsedArray = JSON.parse(trimmedValue);
      return Array.isArray(parsedArray) ? parsedArray : [];
    } catch {
      const innerValue = trimmedValue.slice(1, -1).trim();

      if (!innerValue) {
        return [];
      }

      return innerValue
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    }
  }

  if (trimmedValue === "true") {
    return true;
  }

  if (trimmedValue === "false") {
    return false;
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isNaN(numericValue) && trimmedValue !== "") {
    return numericValue;
  }

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    try {
      return JSON.parse(trimmedValue.replace(/^'/, '"').replace(/'$/, '"'));
    } catch {
      return trimmedValue.replace(/^['"]|['"]$/g, "");
    }
  }

  return trimmedValue;
}

function serializeFrontmatterValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => JSON.stringify(String(item))).join(", ")}]`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(String(value ?? ""));
}

export function parseFrontmatter(markdown: string): FrontmatterParseResult {
  const match = String(markdown).match(FRONTMATTER_REGEX);

  if (!match) {
    return { data: {}, content: String(markdown) };
  }

  const [, rawFrontmatter, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of rawFrontmatter.split("\n")) {
    const colonIndex = line.indexOf(":");

    if (colonIndex < 1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1);
    data[key] = parseFrontmatterValue(rawValue);
  }

  return { data, content };
}

export function serializeFrontmatter(data: PostFrontmatter): string {
  const lines = Object.entries(data).map(
    ([key, value]) => `${key}: ${serializeFrontmatterValue(value)}`,
  );

  return `---\n${lines.join("\n")}\n---`;
}

export async function listBlobsByPrefix(prefix: string) {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await blobClient.list({
      prefix,
      cursor,
      token: getBlobToken(),
    });

    blobs.push(...response.blobs);
    hasMore = Boolean(response.hasMore);
    cursor = response.cursor;
  }

  return blobs;
}

function isHtmlLikePayload(text: string): boolean {
  const trimmed = text.trim().toLowerCase();

  if (!trimmed) {
    return false;
  }

  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<body") ||
    trimmed.includes("<head") ||
    trimmed.includes("<div id=\"root\"") ||
    trimmed.includes("<div id='root'") ||
    trimmed.includes("<script")
  );
}

function validateBlobText(
  pathname: string,
  text: string,
  contentType: string | undefined,
  kind: BlobTextKind,
): string {
  const trimmed = text.trim();
  const normalizedContentType = String(contentType ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (!trimmed) {
    throw new Error(`Blob ${pathname} returned empty ${kind} content`);
  }

  if (normalizedContentType === "text/html") {
    throw new Error(`Blob ${pathname} returned HTML content-type instead of ${kind}`);
  }

  if (isHtmlLikePayload(text)) {
    throw new Error(`Blob ${pathname} returned HTML payload instead of ${kind}`);
  }

  return text;
}

export async function decodeBlobStream(stream: BlobGetResponse["stream"]): Promise<string> {
  return new Response(stream as BodyInit).text();
}

export async function readBlobText(
  pathname: string,
  options: BlobTextReadOptions,
): Promise<string | null> {
  const response = await blobClient.get(pathname, {
    access: "public",
    token: getBlobToken(),
  });

  if (!response) {
    return null;
  }

  if (response.statusCode !== 200 || !response.stream) {
    return null;
  }

  const text = await decodeBlobStream(response.stream);
  return validateBlobText(
    pathname,
    text,
    response.headers.get("content-type") ?? undefined,
    options.kind,
  );
}

export async function putVerifiedTextBlob(
  pathname: string,
  body: string,
  contentType: string,
  kind: BlobTextKind,
) {
  const bodyText = String(body);
  const trimmed = bodyText.trim();

  console.info(`Uploading ${kind} blob`, {
    pathname,
    contentLength: bodyText.length,
    trimmedLength: trimmed.length,
  });

  if (!trimmed) {
    throw new Error(`Refusing to upload empty ${kind} blob for ${pathname}`);
  }

  const uploaded = await blobClient.put(pathname, bodyText, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token: getBlobToken(),
  });
  const verifiedText = await readBlobText(pathname, { kind });

  if (!verifiedText) {
    throw new Error(`Uploaded blob ${pathname} could not be read back`);
  }

  if (verifiedText !== bodyText) {
    throw new Error(
      `Uploaded blob ${pathname} failed verification (expected ${bodyText.length} chars, got ${verifiedText.length})`,
    );
  }

  console.info(`Verified ${kind} blob upload`, {
    pathname,
    verifiedLength: verifiedText.length,
    prefix: verifiedText.slice(0, 120),
  });

  return uploaded;
}

export async function putPublicBlob(
  pathname: string,
  body: string | Buffer,
  contentType: string,
) {
  return blobClient.put(pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token: getBlobToken(),
  });
}

export async function deletePathIfExists(pathname: string): Promise<boolean> {
  const blobs = await listBlobsByPrefix(pathname);
  const exists = blobs.some((blob) => blob.pathname === pathname);

  if (!exists) {
    return false;
  }

  await blobClient.del(pathname, {
    token: getBlobToken(),
  });

  return true;
}

export async function deleteByPrefix(prefix: string): Promise<number> {
  const blobs = await listBlobsByPrefix(prefix);

  if (!blobs.length) {
    return 0;
  }

  await blobClient.del(
    blobs.map((blob) => blob.pathname),
    {
      token: getBlobToken(),
    },
  );

  return blobs.length;
}

function frontmatterToPost(frontmatter: PostFrontmatter, content: string): Post {
  return postSchema.parse({
    slug: frontmatter.slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: frontmatter.date,
    tags: frontmatter.tags,
    readTime: frontmatter.readTime,
    content,
  });
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const markdown = await readBlobText(getPostPath(slug), { kind: "markdown" });

  if (!markdown) {
    return null;
  }

  const { data, content } = parseFrontmatter(markdown);
  const frontmatter = postFrontmatterSchema.parse(data);

  return frontmatterToPost(frontmatter, content);
}

export async function readPostsManifest(): Promise<PostSummary[]> {
  const raw = await readBlobText(getPostsManifestPath(), { kind: "json" });

  if (!raw) {
    return [];
  }

  return postsManifestSchema.parse(JSON.parse(raw));
}

export async function writePostsManifest(posts: PostSummary[]): Promise<void> {
  await putPublicBlob(
    getPostsManifestPath(),
    JSON.stringify(sortPostsByDateDesc(posts), null, 2),
    "application/json; charset=utf-8",
  );
}

export async function listExistingPostSlugs(): Promise<string[]> {
  const blobs = await listBlobsByPrefix("posts/");

  return blobs
    .map((blob) => blob.pathname)
    .filter((pathname) => pathname.endsWith(".md"))
    .map((pathname) => pathname.replace(/^posts\//, "").replace(/\.md$/, ""));
}

export async function upsertPostsManifestEntry(post: PostSummary): Promise<void> {
  const existingPosts = await readPostsManifest();
  const withoutOldEntry = existingPosts.filter((entry) => entry.slug !== post.slug);

  await writePostsManifest([...withoutOldEntry, post]);
}

export async function removePostsManifestEntry(slug: string): Promise<boolean> {
  const existingPosts = await readPostsManifest();
  const nextPosts = existingPosts.filter((entry) => entry.slug !== slug);

  if (nextPosts.length === existingPosts.length) {
    return false;
  }

  await writePostsManifest(nextPosts);
  return true;
}

export async function readPageIndexEntry(pageId: string): Promise<PageIndexEntry | null> {
  const raw = await readBlobText(getPageIndexPath(pageId), { kind: "json" });

  if (!raw) {
    return null;
  }

  return pageIndexEntrySchema.parse(JSON.parse(raw));
}

export async function writePageIndexEntry(entry: PageIndexEntry): Promise<void> {
  await putPublicBlob(
    getPageIndexPath(entry.pageId),
    JSON.stringify(pageIndexEntrySchema.parse(entry), null, 2),
    "application/json; charset=utf-8",
  );
}

export async function deletePageIndexEntry(pageId: string): Promise<boolean> {
  return deletePathIfExists(getPageIndexPath(pageId));
}

export async function listPageIndexEntries(): Promise<PageIndexEntry[]> {
  const blobs = await listBlobsByPrefix("page-index/");

  if (!blobs.length) {
    return [];
  }

  const entries = await Promise.all(
    blobs
      .map((blob) => blob.pathname)
      .filter((pathname) => pathname.endsWith(".json"))
      .map(async (pathname) => {
        const raw = await readBlobText(pathname, { kind: "json" });
        return raw ? pageIndexEntrySchema.parse(JSON.parse(raw)) : null;
      }),
  );

  return entries.filter((entry): entry is PageIndexEntry => entry !== null);
}

export async function findPageIndexEntryBySlug(slug: string): Promise<PageIndexEntry | null> {
  const entries = await listPageIndexEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
}
