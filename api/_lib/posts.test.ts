import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";

import {
  putVerifiedTextBlob,
  readBlobText,
  setBlobClientForTesting,
} from "./posts.ts";

function createStream(text: string) {
  return Readable.from([text]);
}

test("putVerifiedTextBlob uploads non-empty markdown and verifies the readback", async (t) => {
  process.env.BLOB_READ_WRITE_TOKEN = "test-token";

  const store = new Map<string, { text: string; contentType: string }>();

  setBlobClientForTesting({
    put: async (pathname, body, options) => {
      store.set(pathname, {
        text: String(body),
        contentType: options.contentType ?? "text/plain; charset=utf-8",
      });

      return {
        pathname,
        url: `https://blob.example/${pathname}`,
      } as any;
    },
    get: async (pathname) => {
      const entry = store.get(pathname);

      if (!entry) {
        return null;
      }

      return {
        statusCode: 200,
        headers: new Headers({
          "content-type": entry.contentType,
        }),
        stream: createStream(entry.text),
        blob: {} as any,
      } as any;
    },
  });
  t.after(() => setBlobClientForTesting(null));

  const uploaded = await putVerifiedTextBlob(
    "posts/example.md",
    "---\ntitle: \"Example\"\n---\n\nHello world\n",
    "text/markdown; charset=utf-8",
    "markdown",
  );

  assert.equal(uploaded.pathname, "posts/example.md");
  assert.equal(store.get("posts/example.md")?.text, "---\ntitle: \"Example\"\n---\n\nHello world\n");
});

test("putVerifiedTextBlob rejects empty markdown before upload", async (t) => {
  process.env.BLOB_READ_WRITE_TOKEN = "test-token";

  let putCalls = 0;

  setBlobClientForTesting({
    put: async () => {
      putCalls += 1;
      return {
        pathname: "posts/empty.md",
        url: "https://blob.example/posts/empty.md",
      } as any;
    },
  });
  t.after(() => setBlobClientForTesting(null));

  await assert.rejects(
    putVerifiedTextBlob("posts/empty.md", "   \n\t", "text/markdown; charset=utf-8", "markdown"),
    /Refusing to upload empty markdown blob/,
  );
  assert.equal(putCalls, 0);
});

test("readBlobText decodes blob SDK streams", async (t) => {
  process.env.BLOB_READ_WRITE_TOKEN = "test-token";

  setBlobClientForTesting({
    get: async () => ({
      statusCode: 200,
      headers: new Headers({
        "content-type": "text/markdown; charset=utf-8",
      }),
      stream: createStream("---\ntitle: \"Decoded\"\n---\n\nBody\n"),
      blob: {} as any,
    } as any),
  });
  t.after(() => setBlobClientForTesting(null));

  const text = await readBlobText("posts/decoded.md", { kind: "markdown" });

  assert.equal(text, "---\ntitle: \"Decoded\"\n---\n\nBody\n");
});

test("readBlobText rejects HTML payloads for markdown blobs", async (t) => {
  process.env.BLOB_READ_WRITE_TOKEN = "test-token";

  setBlobClientForTesting({
    get: async () => ({
      statusCode: 200,
      headers: new Headers({
        "content-type": "text/html; charset=utf-8",
      }),
      stream: createStream("<!doctype html><html><body><div id=\"root\"></div></body></html>"),
      blob: {} as any,
    } as any),
  });
  t.after(() => setBlobClientForTesting(null));

  await assert.rejects(
    readBlobText("posts/html.md", { kind: "markdown" }),
    /returned HTML content-type instead of markdown/,
  );
});
