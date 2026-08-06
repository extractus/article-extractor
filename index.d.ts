// Type definitions

import { IOptions as SanitizeOptions } from 'sanitize-html'

/**
 * Transformation for per-site HTML pre/post processing.
 */
export interface Transformation {
  /** URL regex patterns to match */
  patterns: Array<RegExp>
  /** Function to pre-process raw HTML before extraction */
  pre?: (document: Document) => Document
  /** Function to post-process extracted article content */
  post?: (document: Document) => Document
}

/**
 * Options for the article extraction process.
 */
export interface ParserOptions {
  /** Words per minute for time-to-read estimation. Default: 300 */
  wordsPerMinute?: number
  /** Max chars for generated description. Default: 210 */
  descriptionTruncateLen?: number
  /** Min chars required for description. Default: 180 */
  descriptionLengthThreshold?: number
  /** Min chars required for content. Default: 200 */
  contentLengthThreshold?: number
}

/**
 * Custom fetch function signature.
 *
 * @param url - URL to fetch
 * @returns Promise resolving to a Response object
 */
export type Fetcher = (url: string) => Promise<Response>

/**
 * Extracted article data structure.
 */
export interface ArticleData {
  /** Best resolved URL of the article */
  url?: string
  /** Alternative URLs (canonical, shortlink, etc.) */
  links?: string[]
  /** Article title */
  title?: string
  /** Short description or excerpt */
  description?: string
  /** Main image URL */
  image?: string
  /** Site favicon URL */
  favicon?: string
  /** Author name */
  author?: string
  /** Extracted article HTML content */
  content?: string
  /** Original publisher/source domain */
  source?: string
  /** Publication date string */
  published?: string
  /** Estimated time to read in seconds (0 = unknown) */
  ttr?: number
  /** Page type (e.g. article) */
  type?: string
}

/**
 * Register one or more transformations for per-site HTML processing.
 *
 * @param transformations - Single transformation or array of transformations
 * @returns Number of transformations successfully added
 */
export function addTransformations (transformations: Transformation | Array<Transformation>): number

/**
 * Remove transformations matching the given patterns.
 * Calling without arguments removes all transformations.
 *
 * @param patterns - URL patterns to match for removal
 * @returns Number of transformations removed
 */
export function removeTransformations (patterns?: Array<RegExp>): number

/**
 * Get a copy of the current sanitize-html options.
 */
export function getSanitizeHtmlOptions (): SanitizeOptions

/**
 * Update sanitize-html options by merging with the current ones.
 *
 * @param options - Partial sanitize options to merge
 */
export function setSanitizeHtmlOptions (options: SanitizeOptions): void

/**
 * Load and extract article data from a URL or HTML string.
 *
 * @param input - URL or HTML string to extract from
 * @param parserOptions - Options for parsing
 * @param fetcher - Custom fetch function (url) => Promise<Response>. Defaults to globalThis.fetch.
 * @returns Extracted article data or null
 */
export function extract (
  input: string,
  parserOptions?: ParserOptions,
  fetcher?: Fetcher,
): Promise<ArticleData | null>

/**
 * Extract article data from an HTML string directly.
 *
 * @param html - Raw HTML content
 * @param url - Source URL for resolving relative links
 * @param parserOptions - Options for parsing
 * @returns Extracted article data or null
 */
export function extractFromHtml (
  html: string,
  url?: string,
  parserOptions?: ParserOptions,
): Promise<ArticleData | null>
