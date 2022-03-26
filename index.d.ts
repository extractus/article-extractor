// Type definitions

import {AxiosRequestConfig} from "axios";
import {IOptions as SanitizeOptions} from "sanitize-html";
import {defaults} from "html-crush";
import {URLPatternInit} from "urlpattern-polyfill/dist/url-pattern.interfaces";

type HtmlCrushOptions = Partial<typeof defaults>

/**
 * @example
 * {
 *   patterns: [
 *     'https://example.com/books/:id', {
 *       protocol: 'https',
 *       hostname: 'example.com',
 *       pathname: '/books/:id',
 *     }
 *   ],
 *   selector: '.article-body',
 *   unwanted: ['.removing-box']
 * }
 */
export interface QueryRule {
  patterns: Array<URLPatternInit | string>,
  unwanted?: Array<String>,
  selector?: String,
  transform?: (document: Document) => Document
}

/**
 * @param input url or html
 */
export function extract(input: string): Promise<ArticleData>;

export function setParserOptions(options: ParserOptions): void;

export function setRequestOptions(options: AxiosRequestConfig): void;

export function setSanitizeHtmlOptions(options: SanitizeOptions): void;

export function setHtmlCrushOptions(options: HtmlCrushOptions): void;

export function addQueryRules(...rules: Array<QueryRule>): Number;

export function getQueryRules(): Array<QueryRule>;

export function setQueryRules(rules: Array<QueryRule>): void;

export function getParserOptions(): ParserOptions;

export function getRequestOptions(): AxiosRequestConfig;

export function getSanitizeHtmlOptions(): SanitizeOptions;

export function getHtmlCrushOptions(): HtmlCrushOptions;

export interface ParserOptions {
  /**
   * For estimating "time to read".
   * Default: 300
   */
  wordsPerMinute: number
  /**
   * To find the best url from list
   */
  urlsCompareAlgorithm: 'levenshtein' | 'cosine' | 'diceCoefficient' | 'jaccardIndex' | 'lcs' | 'mlcs'
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
