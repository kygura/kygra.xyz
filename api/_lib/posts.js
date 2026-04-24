import { list } from "@vercel/blob";

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

function parseFrontmatterValue(rawValue) {
  const trimmedValue = rawValue.trim();

  if (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
    const innerValue = trimmedValue.slice(1, -1).trim();
    if (!innerValue) {
      return [];
    }

    return innerValue
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
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

  return trimmedValue.replace(/^["']|["']$/g, "");
}

export function parseMarkdownFile(markdown) {
  const match = markdown.match(FRONTMATTER_REGEX);

  if (!match) {
    return { data: {}, content: markdown };
  }

  const [, rawFrontmatter, content] = match;
  const data = {};

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

export function normalizeSlug(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildPostSummary(slug, data, content = "") {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    excerpt: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    category: typeof data.category === "string" ? data.category : "General",
    tags: Array.isArray(data.tags) ? data.tags : [],
    readTime: typeof data.readTime === "number" ? data.readTime : Number(data.readTime) || 10,
    content,
  };
}

export async function getBlobByPath(pathname) {
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  return blobs.find((blob) => blob.pathname === pathname) ?? null;
}

export async function fetchPostFromBlob(pathname) {
  const blob = await getBlobByPath(pathname);
  if (!blob) {
    return null;
  }

  const response = await fetch(blob.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch blob content for ${pathname}`);
  }

  const markdown = await response.text();
  const { data, content } = parseMarkdownFile(markdown);
  const slug = pathname.replace(/^posts\//, "").replace(/\.md$/, "");

  return {
    pathname,
    blob,
    markdown,
    content,
    data,
    post: buildPostSummary(slug, data, content),
  };
}
