// main.ts

import { isString } from "@pwshub/bellajs";

import retrieve from "./utils/retrieve.ts";
import parseFromHtml from "./utils/parseFromHtml.ts";
import { getCharset } from "./utils/html.ts";
import { isValid as isValidUrl } from "./utils/linker.ts";

/** Custom fetch function signature. */
export type Fetcher = (url: string) => Promise<Response>;

/** Per-site HTML pre/post processing transformation. */
export interface Transformation {
  /** URL regex patterns to match against article links. */
  patterns: RegExp[];
  /** Function to pre-process raw HTML before extraction. */
  pre?: (document: Document) => Document;
  /** Function to post-process extracted article content. */
  post?: (document: Document) => Document;
}

/** Options for the article extraction process. */
export interface ParserOptions {
  /** Words per minute for time-to-read estimation. Default: 300 */
  wordsPerMinute?: number;
  /** Max characters for generated description. Default: 210 */
  descriptionTruncateLen?: number;
  /** Min characters required to keep meta description. Default: 180 */
  descriptionLengthThreshold?: number;
  /** Min characters required for article content. Default: 200 */
  contentLengthThreshold?: number;
}

/** Extracted article data structure. */
export interface ArticleData {
  /** Best resolved URL of the article. */
  url?: string;
  /** Alternative URLs discovered (canonical, shortlink, amphtml). */
  links?: string[];
  /** Article title. */
  title?: string;
  /** Short description or excerpt. */
  description?: string;
  /** Main image URL. */
  image?: string;
  /** Site favicon URL. */
  favicon?: string;
  /** Author name. */
  author?: string;
  /** Extracted article HTML content. */
  content?: string;
  /** Original publisher/source domain. */
  source?: string;
  /** Publication date string. */
  published?: string;
  /** Estimated time to read in seconds. */
  ttr?: number;
  /** Page type (e.g. "article"). */
  type?: string;
}

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
  if (!isString(input)) {
    throw new Error("Input must be a string");
  }

  if (!isValidUrl(input)) {
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

export { addTransformations, removeTransformations } from "./utils/transformation.ts";
export { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from "./config.ts";
