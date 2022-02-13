// Type definitions

import {AxiosRequestConfig} from "axios";
import * as sanitize from "sanitize-html";

/**
 * @example
 * {
 *   patterns: [new RegExp("somewhere.com\/*")],
 *   selector: '.article-body',
 *   unwanted: ['.removing-box']
 * }
 */
export interface QueryRule {
  patterns: Array<RegExp>,
  unwanted?: Array<String>,
  selector?: String
}

/**
 * @param input url or html
 */
export function extract(input: string): Promise<ArticleData>;

export function setParserOptions(options: ParserOptions): void;

export function setRequestOptions(options: AxiosRequestConfig): void;

export function setSanitizeHtmlOptions(options: sanitize.IOptions): void;

export function addQueryRules(rules: Array<QueryRule>): Number;

export function getParserOptions(): ParserOptions;

export function getRequestOptions(): AxiosRequestConfig;

export function getSanitizeHtmlOptions(): sanitize.IOptions;

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
