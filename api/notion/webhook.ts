import crypto from "node:crypto";
import { z } from "zod";
import {
  DuplicatePublishedSlugError,
  syncNotionPageById,
} from "../_lib/notion-sync.ts";
import { getWebhookVerificationToken } from "../_lib/posts.ts";

const verificationPayloadSchema = z.object({
  verification_token: z.string().trim().min(1),
});

const webhookEventSchema = z.object({
  id: z.string().trim().optional(),
  type: z.string().trim().optional(),
  attempt_number: z.number().int().positive().optional(),
  timestamp: z.string().trim().optional(),
  entity: z
    .object({
      id: z.string().trim().optional(),
      type: z.string().trim().optional(),
    })
    .optional(),
});

const supportedEventTypes = new Set([
  "page.created",
  "page.properties_updated",
  "page.content_updated",
  "page.deleted",
  "page.undeleted",
]);

function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", getWebhookVerificationToken())
    .update(rawBody)
    .digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function extractPageId(payload: z.infer<typeof webhookEventSchema>): string | null {
  if (payload.entity?.type === "page" && payload.entity.id) {
    return payload.entity.id;
  }

  if (payload.entity?.id) {
    return payload.entity.id;
  }

  return null;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const verificationPayload = verificationPayloadSchema.safeParse(parsedBody);

  if (verificationPayload.success) {
    const configuredToken = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;

    return Response.json({
      ok: true,
      verificationToken: verificationPayload.data.verification_token,
      matchesConfiguredToken: configuredToken
        ? configuredToken === verificationPayload.data.verification_token
        : null,
    });
  }

  if (!isValidSignature(rawBody, request.headers.get("x-notion-signature"))) {
    return Response.json({ error: "Invalid Notion signature" }, { status: 401 });
  }

  const eventPayload = webhookEventSchema.safeParse(parsedBody);

  if (!eventPayload.success) {
    return Response.json({ error: "Invalid webhook event payload" }, { status: 400 });
  }

  const event = eventPayload.data;

  if (!event.type || !supportedEventTypes.has(event.type)) {
    return Response.json({
      ok: true,
      ignored: true,
      reason: "Unsupported event type",
      eventType: event.type ?? null,
      eventId: event.id ?? null,
    });
  }

  const pageId = extractPageId(event);

  if (!pageId) {
    return Response.json(
      {
        ok: true,
        ignored: true,
        reason: "Missing page identifier",
        eventType: event.type,
        eventId: event.id ?? null,
      },
      { status: 202 },
    );
  }

  try {
    const result = await syncNotionPageById(pageId);

    return Response.json({
      ok: true,
      eventId: event.id ?? null,
      eventType: event.type,
      attemptNumber: event.attempt_number ?? null,
      ...result,
    });
  } catch (error) {
    console.error("Failed to process Notion webhook", error);

    if (error instanceof DuplicatePublishedSlugError) {
      return Response.json(
        {
          error: error.message,
          duplicateSlugs: error.duplicateSlugs,
          pageId,
          eventType: event.type,
        },
        { status: 409 },
      );
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to process Notion webhook",
        pageId,
        eventType: event.type,
      },
      { status: 500 },
    );
  }
}
