// Type definitions

import { IOptions as SanitizeOptions } from "sanitize-html";

export interface Transformation {
  patterns: Array<RegExp>,
  pre?: (document: Document) => Document
  post?: (document: Document) => Document
}

export function addTransformations(transformations: Array<Transformation>): Number;
export function removeTransformations(options: Array<RegExp>): Number;

export function getParserOptions(): ParserOptions;
export function setParserOptions(options: ParserOptions): void;

export function getSanitizeHtmlOptions(): SanitizeOptions;
export function setSanitizeHtmlOptions(options: SanitizeOptions): void;

/**
 * @param input url or html
 */

export interface ParserOptions {
  /**
   * For estimating "time to read".
   * Default: 300
   */
  wordsPerMinute: number
  /**
   * Min num of chars required for description
   * Default: 40
   */
  descriptionLengthThreshold: number
  /**
   * Max num of chars generated for description
   * Default: 156
   */
  descriptionTruncateLen: number
  /**
   * Min num of chars required for content
   * Default: 200
   */
  contentLengthThreshold: number
}

export interface ArticleData {
  url?: string;
  links?: string[];
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  content?: string;
  source?: string;
  published?: string;
  ttr?: number;
}

export function extract(input: string): Promise<ArticleData>;
