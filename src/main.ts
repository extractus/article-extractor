// main.ts

import retrieve from "./utils/retrieve.ts";
import parseFromHtml from "./utils/parseFromHtml.ts";
import { getCharset, isHTML } from "./utils/html.ts";
import { isValid as isValidUrl } from "./utils/linker.ts";

import type { ArticleData, Fetcher, ParserOptions } from "./types.ts";

/**
 * Load and extract article data from a URL or HTML string.
 *
 * @param input - URL or HTML string to extract from
 * @param parserOptions - Options for parsing
 * @param fetcher - Custom fetch function. Defaults to globalThis.fetch.
 * @returns Extracted article data or null
 */
export const extract = async (
  input: string,
  parserOptions: ParserOptions = {},
  fetcher: Fetcher = globalThis.fetch,
): Promise<ArticleData | null> => {
  const inputType = isValidUrl(input)
    ? "url"
    : isHTML(input)
    ? "html"
    : "other";

  if (inputType === "other") {
    throw new Error("Input must be a URL or raw HTML");
  }

  if (inputType === "html") {
    return parseFromHtml(input, "", parserOptions);
  }

  const buffer = await retrieve(input, fetcher);
  const text = buffer ? new TextDecoder().decode(buffer).trim() : "";
  if (!text) {
    return null;
  }
  const charset = getCharset(text);
  const decoder = new TextDecoder(charset);
  const html = decoder.decode(buffer);
  return parseFromHtml(html, input, parserOptions);
};

/**
 * Extract article data from an HTML string directly.
 *
 * @param html - Raw HTML content
 * @param url - Source URL for resolving relative links
 * @param parserOptions - Options for parsing
 * @returns Extracted article data or null
 */
// deno-lint-ignore require-await
export const extractFromHtml = async (
  html: string,
  url?: string,
  parserOptions: ParserOptions = {},
): Promise<ArticleData | null> => {
  return parseFromHtml(html, url || "", parserOptions);
};

export {
  addTransformations,
  removeTransformations,
} from "./utils/transformation.ts";

export * from "./types.ts";
