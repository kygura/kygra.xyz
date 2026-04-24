import { fetchPostFromBlob } from "../_lib/posts.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const slugParam = request.query?.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    if (!slug) {
      return response.status(400).json({ error: "Slug is required" });
    }

    const postRecord = await fetchPostFromBlob(`posts/${slug}.md`);
    if (!postRecord || postRecord.data.published === false) {
      return response.status(404).json({ error: "Post not found" });
    }

    return response.status(200).json(postRecord.post);
  } catch (error) {
    console.error("Failed to fetch post", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch post",
    });
  }
}
