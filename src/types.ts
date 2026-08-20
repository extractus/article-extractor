// types.ts

/** Custom fetch function signature. */
export type Fetcher = (url: string) => Promise<Response>;

/** Per-site HTML pre/post processing transformation. */
export type Transformation = {
  /** URL regex patterns to match against article links. */
  patterns: RegExp[];
  /** Function to pre-process raw HTML before extraction. */
  pre?: (document: Document) => Document;
  /** Function to post-process extracted article content. */
  post?: (document: Document) => Document;
};

/** Options for the article extraction process. */
export type ParserOptions = {
  /** Words per minute for time-to-read estimation. Default: 300 */
  wordsPerMinute?: number;
  /** Max characters for generated description. Default: 210 */
  descriptionTruncateLen?: number;
  /** Min characters required to keep meta description. Default: 180 */
  descriptionLengthThreshold?: number;
  /** Min characters required for article content. Default: 200 */
  contentLengthThreshold?: number;
  /** Allowed HTML tags in output. Default: list of semantic/content tags. */
  allowedTags?: string[];
  /** Per-tag allowed attributes. Default: src, href, alt, etc. */
  allowedAttributes?: Record<string, string[]>;
  /** Allowed domains for iframe src. Default: youtube, vimeo, etc. */
  allowedIframeDomains?: string[];
};

/** Extracted article data structure. */
export type ArticleData = {
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
};
