import { sortPostsByDateDesc } from "../content/posts.ts";
import { readPostsManifest } from "./_lib/posts.ts";

export const runtime = "nodejs";

export async function GET() {
  try {
    const posts = await readPostsManifest();

    return Response.json(sortPostsByDateDesc(posts), {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to list posts", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to list posts",
      },
      { status: 500 },
    );
  }
}
