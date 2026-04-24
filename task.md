# Claude Code Prompt — Notion → Vercel Blob Pipeline

## Context

You are building a serverless webhook pipeline for `kygura/kygra-portfolio`.

**Goal:** When a page in the Notion "Publications" database has `Published = true`, automatically store the post as markdown in **Vercel Blob Storage**, and refactor the React site to fetch posts from Blob at runtime instead of using static file imports.

---

## Current Setup (important)

- Repo: `kygura/kygra-portfolio`, branch: `master`
- Posts currently live in `src/posts/*.md` as static files
- `src/hooks/useMarkdownPosts.ts` uses `import.meta.glob("../posts/*.md", { eager: true, query: "?raw" })` — this must be replaced
- The site is a Vite + React SPA deployed on Vercel

---

## Frontmatter Schema (must match exactly)

```
---
title: "string"
description: "string"
date: "YYYY-MM-DD"
type: "string"
category: "string"
tags: [tag1, tag2]
readTime: number
---
```

---

## Phase 1: Refactor `useMarkdownPosts.ts`

Replace the static `import.meta.glob` approach with an async fetch from Vercel Blob.

**New behavior:**
- On mount, fetch `GET /api/posts` — a new Vercel serverless function that lists all blobs and returns post metadata
- Parse frontmatter from each blob's content
- Return the same `Post[]` interface as before so no other components need to change

**Post interface (preserve exactly):**
```ts
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  readTime: number;
}
```

Use `useState` + `useEffect` for async loading. Return `{ posts, loading, error }` from the hook instead of just `posts[]`. Update any consuming components (`Writings.tsx`, `Post.tsx`) to handle the loading state gracefully.

---

## Phase 2: Create `api/posts.js` — Post listing endpoint

A Vercel serverless function that:

1. Calls `list()` from `@vercel/blob` to get all blobs in the store
2. For each blob, fetches its content and parses the frontmatter
3. Returns a JSON array of post metadata (all fields except `content` to keep payload small)
4. Filters out any blobs where `published` frontmatter field is missing or false

---

## Phase 3: Create `api/post/[slug].js` — Single post endpoint

A Vercel serverless function that:

1. Receives `slug` from the URL param
2. Fetches the blob at path `posts/{slug}.md` from Vercel Blob
3. Returns the full markdown content as JSON: `{ content, ...frontmatterFields }`
4. Returns 404 if not found

Update `useMarkdownPost(slug)` to fetch from this endpoint instead of filtering the local array.

---

## Phase 4: Create `api/notion-webhook.js` — Webhook handler

This is the core ingestion function.

### 4a. Dependencies (add to package.json)

- `notion-to-md` — converts Notion blocks to markdown
- `@notionhq/client` — official Notion SDK
- `@vercel/blob` — Vercel Blob SDK

### 4b. Webhook Verification

- On first call, Notion sends a `GET` with `?challenge=xxx` — respond with `{ challenge }` to verify the endpoint
- On subsequent `POST` calls, verify the `x-notion-signature` header using HMAC-SHA256 with the `WEBHOOK_SECRET` env var
- Return `401` if signature is invalid

### 4c. Main Handler Logic (POST)

**a)** Parse the webhook payload — Notion sends `page.updated` or `page.created` events

**b)** Extract the `page_id` from `payload.entity.id` (or `payload.page.id` depending on event type)

**c)** Fetch the full page from Notion API to read its properties

**d)** Check: if the `Published` checkbox property is NOT `true`, return `200` and do nothing

**e)** Extract these properties from the page:

| Property | Notion Type | Frontmatter Field |
|---|---|---|
| Title | Title | `title` |
| Description | Rich text | `description` |
| Date | Date | `date` (YYYY-MM-DD) |
| Type | Select | `type` |
| Category | Select | `category` |
| Tags | Multi-select | `tags` (array) |
| Read Time | Number | `readTime` |
| Slug | Text | `slug` (fallback: slugify title) |

Slug fallback rule: lowercase, replace spaces with hyphens, strip special characters.

**f)** Use `notion-to-md` to convert the page's block content to a markdown string

**g)** Assemble the final markdown string:

```
---
title: "{title}"
description: "{description}"
date: "{date}"
type: "{type}"
category: "{category}"
tags: [{tags joined with ", "}]
readTime: {readTime}
---

{markdown body}
```

**h)** Upload to Vercel Blob:

```js
import { put } from '@vercel/blob';

await put(`posts/${slug}.md`, markdownContent, {
  access: 'public',
  contentType: 'text/markdown',
  addRandomSuffix: false,
});
```

This overwrites the file if it already exists — handles both create and update.

### 4d. Unpublish Handler

If `Published` flips to `false`:

```js
import { del, list } from '@vercel/blob';

const { blobs } = await list({ prefix: `posts/${slug}.md` });
if (blobs.length > 0) {
  await del(blobs[0].url);
}
```

Return `200` silently if the blob doesn't exist.

### 4e. Error Handling

- Wrap everything in `try/catch`
- Return `500` with `{ error: message }` on failure
- Log all errors to `console.error`
- Respond to Notion quickly (within ~3s) — fire the Blob write after sending `200` if needed to avoid webhook timeouts

---

## Phase 5: Environment Variables

Create a `.env.example` file:

```
NOTION_SECRET=
NOTION_DATABASE_ID=
BLOB_READ_WRITE_TOKEN=
WEBHOOK_SECRET=
```

`BLOB_READ_WRITE_TOKEN` is auto-provided by Vercel when you enable Blob Storage on the project. No GitHub token needed.

---

## Phase 6: Update `vercel.json`

Ensure the file includes the SPA rewrite and function runtime config. Do not remove the existing rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "functions": {
    "api/notion-webhook.js": { "runtime": "nodejs20.x" },
    "api/posts.js": { "runtime": "nodejs20.x" },
    "api/post/[slug].js": { "runtime": "nodejs20.x" }
  }
}
```

---

## After Creating the Files

1. Run: `npm install --save @notionhq/client notion-to-md @vercel/blob`
2. Confirm `package.json` was updated
3. Show me all created/modified files:
   - `api/notion-webhook.js`
   - `api/posts.js`
   - `api/post/[slug].js`
   - `src/hooks/useMarkdownPosts.ts` (refactored)
   - `.env.example`
   - `vercel.json` (updated)
4. Do **not** delete files from `src/posts/` — leave existing markdown files in place
5. Do **not** modify any UI components beyond the minimum needed to handle the new async loading state

---

## Post-Deploy Steps (instructions only — do not automate)

1. In Vercel dashboard → **Storage** → create a Blob store and link it to the project (this auto-sets `BLOB_READ_WRITE_TOKEN`)
2. Add remaining env vars: `NOTION_SECRET`, `NOTION_DATABASE_ID`, `WEBHOOK_SECRET`
3. Go to [notion.so/my-integrations](https://notion.so/my-integrations) → your integration → **Webhooks**
4. Register URL: `https://kygra.xyz/api/notion-webhook`
5. Triggers: `page.updated`, `page.created`
6. Secret: use the value of `WEBHOOK_SECRET`
7. Ensure the integration has **read access** to the Publications database (share it with the integration in Notion)

---

## Optional: Seed Existing Posts

After deploy, existing `src/posts/*.md` files can be uploaded to Blob manually via the Vercel dashboard or a one-off script — they won't be auto-migrated by this pipeline.

---

## Test Flow

1. Create a new page in the Publications database with `Published = false`
2. Fill in all properties (title, description, date, category, tags, readTime)
3. Flip `Published` to `true`
4. Check Vercel function logs — confirm a blob was written to `posts/{slug}.md`
5. Hit `GET /api/posts` — confirm the post appears in the response
6. Navigate to the Writings page on the site — confirm the post renders
