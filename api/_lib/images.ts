import crypto from "node:crypto";
import sharp from "sharp";
import {
  deleteByPrefix,
  deletePathIfExists,
  listBlobsByPrefix,
  putPublicBlob,
} from "./posts.ts";

const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)/g;
const MAX_IMAGE_WIDTH = 1600;

export type PreparedImageAsset = {
  sourceUrl: string;
  pathname: string;
  body: Buffer;
  contentType: string;
};

function mimeToExtension(contentType: string | null): string {
  const mime = String(contentType ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    case "image/avif":
      return "avif";
    default:
      return "";
  }
}

type MarkdownImageMatch = {
  alt: string;
  url: string;
  title: string;
  fullMatch: string;
};

export function extractMarkdownImageUrls(markdown: string): MarkdownImageMatch[] {
  return Array.from(String(markdown).matchAll(MARKDOWN_IMAGE_REGEX)).map((match) => ({
    alt: match[1] ?? "",
    url: match[2] ?? "",
    title: match[3] ?? "",
    fullMatch: match[0],
  }));
}

export function isNotionHostedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    return (
      hostname.includes("secure.notion-static.com") ||
      hostname.includes("notion-static.com") ||
      hostname.includes("prod-files-secure.s3.") ||
      hostname.includes(".amazonaws.com")
    );
  } catch {
    return false;
  }
}

async function downloadRemoteImage(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${url}`);
  }

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type"),
  };
}

function inferImageExtension(url: string, contentType: string | null): string {
  const mimeExtension = mimeToExtension(contentType);

  if (mimeExtension) {
    return mimeExtension;
  }

  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase() ?? "";

    return extension.replace(/[^a-z0-9]/g, "") || "jpg";
  } catch {
    return "jpg";
  }
}

async function compressImage(buffer: Buffer, contentType: string | null, sourceUrl: string) {
  const inputExtension = inferImageExtension(sourceUrl, contentType);
  const image = sharp(buffer, {
    animated: true,
    failOnError: false,
  });
  const metadata = await image.metadata();

  if (metadata.format === "gif" || (metadata.pages ?? 0) > 1) {
    return {
      buffer,
      contentType: contentType || "image/gif",
      extension: inputExtension || "gif",
    };
  }

  if (metadata.format === "svg") {
    return {
      buffer,
      contentType: contentType || "image/svg+xml",
      extension: inputExtension || "svg",
    };
  }

  let pipeline = sharp(buffer, {
    failOnError: false,
  }).rotate();

  if (metadata.width && metadata.width > MAX_IMAGE_WIDTH) {
    pipeline = pipeline.resize({
      width: MAX_IMAGE_WIDTH,
      withoutEnlargement: true,
    });
  }

  if (metadata.hasAlpha) {
    return {
      buffer: await pipeline
        .png({
          compressionLevel: 9,
          palette: true,
          quality: 80,
        })
        .toBuffer(),
      contentType: "image/png",
      extension: "png",
    };
  }

  return {
    buffer: await pipeline
      .jpeg({
        quality: 72,
        mozjpeg: true,
        progressive: true,
      })
      .toBuffer(),
    contentType: "image/jpeg",
    extension: "jpg",
  };
}

function buildImageBlobPath(postSlug: string, imageBuffer: Buffer, extension: string): string {
  const digest = crypto.createHash("sha1").update(imageBuffer).digest("hex").slice(0, 16);
  return `images/${postSlug}/${digest}.${extension}`;
}

function rewriteMarkdownImageUrls(markdown: string, replacements: Map<string, string>): string {
  return String(markdown).replace(
    MARKDOWN_IMAGE_REGEX,
    (fullMatch, alt, url, title = "") => {
      const replacementUrl = replacements.get(url);

      if (!replacementUrl) {
        return fullMatch;
      }

      if (title) {
        return `![${alt}](${replacementUrl} "${title}")`;
      }

      return `![${alt}](${replacementUrl})`;
    },
  );
}

export async function prepareMarkdownImageAssets(
  markdown: string,
  { postSlug }: { postSlug: string },
): Promise<PreparedImageAsset[]> {
  const matches = extractMarkdownImageUrls(markdown);
  const sourceUrls = [...new Set(matches.map((match) => match.url).filter(isNotionHostedImageUrl))];

  return Promise.all(
    sourceUrls.map(async (sourceUrl) => {
      const downloaded = await downloadRemoteImage(sourceUrl);
      const compressed = await compressImage(downloaded.buffer, downloaded.contentType, sourceUrl);

      return {
        sourceUrl,
        pathname: buildImageBlobPath(postSlug, compressed.buffer, compressed.extension),
        body: compressed.buffer,
        contentType: compressed.contentType,
      };
    }),
  );
}

export async function commitMarkdownImageAssets(markdown: string, assets: PreparedImageAsset[]) {
  const replacements = new Map<string, string>();
  const pathnames = new Set<string>();

  for (const asset of assets) {
    const uploaded = await putPublicBlob(asset.pathname, asset.body, asset.contentType);
    replacements.set(asset.sourceUrl, uploaded.url);
    pathnames.add(asset.pathname);
  }

  return {
    markdown: rewriteMarkdownImageUrls(markdown, replacements),
    pathnames: [...pathnames],
  };
}

export async function cleanupPostImages(postSlug: string, keepPathnames: string[] = []) {
  const prefix = `images/${postSlug}/`;
  const keepSet = new Set(keepPathnames);
  const blobs = await listBlobsByPrefix(prefix);

  await Promise.all(
    blobs
      .filter((blob) => !keepSet.has(blob.pathname))
      .map((blob) => deletePathIfExists(blob.pathname)),
  );
}

export async function deleteAllPostImages(postSlug: string) {
  return deleteByPrefix(`images/${postSlug}/`);
}
