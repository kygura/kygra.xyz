import { DuplicatePublishedSlugError, fullSyncNotionPosts } from "../_lib/notion-sync.ts";
import { getSyncTriggerSecret } from "../_lib/posts.ts";

function isAuthorized(request: Request): boolean {
  const header = request.headers.get("authorization");
  return header === `Bearer ${getSyncTriggerSecret()}`;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fullSyncNotionPosts();
    return Response.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("Failed to sync Notion posts", error);

    if (error instanceof DuplicatePublishedSlugError) {
      return Response.json(
        {
          error: error.message,
          duplicateSlugs: error.duplicateSlugs,
        },
        { status: 409 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to sync Notion posts",
      },
      { status: 500 },
    );
  }
}
