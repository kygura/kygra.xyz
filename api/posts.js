import { list } from "@vercel/blob";
import { buildPostSummary, parseMarkdownFile } from "./_lib/posts.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blobs } = await list({ prefix: "posts/" });

    const posts = await Promise.all(
      blobs
        .filter((blob) => blob.pathname.endsWith(".md"))
        .map(async (blob) => {
          const blobResponse = await fetch(blob.url);
          if (!blobResponse.ok) {
            throw new Error(`Failed to fetch blob content for ${blob.pathname}`);
          }

          const markdown = await blobResponse.text();
          const { data } = parseMarkdownFile(markdown);

          if (data.published === false) {
            return null;
          }

          const slug = blob.pathname.replace(/^posts\//, "").replace(/\.md$/, "");
          const post = buildPostSummary(slug, data);
          return {
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            category: post.category,
            tags: post.tags,
            readTime: post.readTime,
          };
        }),
    );

    const sortedPosts = posts
      .filter(Boolean)
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

    return response.status(200).json(sortedPosts);
  } catch (error) {
    console.error("Failed to list posts", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to list posts",
    });
  }
}
