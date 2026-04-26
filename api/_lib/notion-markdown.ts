import type { MdBlock, MdStringObject } from "notion-to-md/build/types";

type NotionMarkdownSerializer = {
  toMarkdownString(markdownBlocks?: MdBlock[]): MdStringObject;
};

export function notionMarkdownBlocksToString(
  markdownBlocks: MdBlock[],
  notionToMarkdown: NotionMarkdownSerializer,
): string {
  const result = notionToMarkdown.toMarkdownString(markdownBlocks);
  return String(result.parent ?? "").trim();
}
