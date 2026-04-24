import crypto from "node:crypto";
import { Client } from "@notionhq/client";
import { del, put } from "@vercel/blob";
import { NotionToMarkdown } from "notion-to-md";
import { fetchPostFromBlob, normalizeSlug } from "./_lib/posts.js";

const notion = new Client({ auth: process.env.NOTION_SECRET });
const n2m = new NotionToMarkdown({ notionClient: notion });

function getHeaderValue(headers, name) {
  const header = headers?.[name] ?? headers?.[name.toLowerCase()];
  return Array.isArray(header) ? header[0] : header;
}

function safeString(value) {
  return String(value ?? "").replace(/"/g, '\\"');
}

function extractTitle(property) {
  return property?.title?.map((item) => item.plain_text).join("").trim() ?? "";
}

function extractRichText(property) {
  return property?.rich_text?.map((item) => item.plain_text).join("").trim() ?? "";
}

function extractSelect(property) {
  return property?.select?.name ?? "";
}

function extractMultiSelect(property) {
  return property?.multi_select?.map((item) => item.name).filter(Boolean) ?? [];
}

function extractNumber(property) {
  return typeof property?.number === "number" ? property.number : 0;
}

function extractCheckbox(property) {
  return Boolean(property?.checkbox);
}

function extractDate(property) {
  return property?.date?.start ?? "";
}

function extractSlug(properties, title) {
  const explicitSlug =
    extractRichText(properties?.Slug) ||
    extractRichText(properties?.slug) ||
    extractTitle(properties?.Slug) ||
    extractTitle(properties?.slug);

  return normalizeSlug(explicitSlug || title);
}

async function readRawBody(request) {
  if (typeof request.body === "string") {
    return request.body;
  }

  if (request.body && typeof request.body === "object" && !(request.body instanceof Buffer)) {
    return JSON.stringify(request.body);
  }

  return await new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function verifySignature(rawBody, signature, secret) {
  if (!signature || !secret) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function deletePostBlob(slug) {
  const existingPost = await fetchPostFromBlob(`posts/${slug}.md`);
  if (existingPost) {
    await del(existingPost.blob.url);
  }
}

async function syncNotionPage(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const properties = page.properties ?? {};

  const title = extractTitle(properties.Title ?? properties.Name ?? properties.title);
  const slug = extractSlug(properties, title || pageId);
  const published = extractCheckbox(properties.Published ?? properties.published);

  if (!published) {
    await deletePostBlob(slug);
    return { slug, published: false };
  }

  const description = extractRichText(properties.Description ?? properties.description);
  const date = extractDate(properties.Date ?? properties.date);
  const type = extractSelect(properties.Type ?? properties.type);
  const category = extractSelect(properties.Category ?? properties.category);
  const tags = extractMultiSelect(properties.Tags ?? properties.tags);
  const readTime = extractNumber(properties["Read Time"] ?? properties.readTime ?? properties["Read time"]);

  const markdownBlocks = await n2m.pageToMarkdown(pageId);
  const markdownBody = n2m.toMarkdownString(markdownBlocks).parent ?? "";
  const serializedTags = tags.join(", ");

  const markdownContent = `---
title: "${safeString(title)}"
description: "${safeString(description)}"
date: "${safeString(date)}"
type: "${safeString(type)}"
category: "${safeString(category)}"
tags: [${serializedTags}]
readTime: ${readTime}
---

${markdownBody}
`;

  await put(`posts/${slug}.md`, markdownContent, {
    access: "public",
    contentType: "text/markdown",
    addRandomSuffix: false,
  });

  return { slug, published: true };
}

export default async function handler(request, response) {
  if (request.method === "GET") {
    const challenge = request.query?.challenge;
    return response.status(200).json({ challenge });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await readRawBody(request);
    const signature = getHeaderValue(request.headers, "x-notion-signature");
    const secret = process.env.WEBHOOK_SECRET;

    if (!verifySignature(rawBody, signature, secret)) {
      return response.status(401).json({ error: "Invalid signature" });
    }

    const payload = rawBody ? JSON.parse(rawBody) : {};
    const pageId = payload?.entity?.id ?? payload?.page?.id;

    if (!pageId) {
      return response.status(200).json({ ok: true, skipped: true });
    }

    const result = await syncNotionPage(pageId);
    return response.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error("Failed to process Notion webhook", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process Notion webhook",
    });
  }
}
