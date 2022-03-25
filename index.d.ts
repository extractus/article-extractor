// Type definitions

import {AxiosRequestConfig} from "axios";
import {IOptions as SanitizeOptions} from "sanitize-html";
import {URLPatternInit} from "urlpattern-polyfill/dist/url-pattern.interfaces";


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

export function addQueryRules(...rules: Array<QueryRule>): Number;

export function getQueryRules(): Array<QueryRule>;

export function setQueryRules(rules: Array<QueryRule>): void;

export function getParserOptions(): ParserOptions;

export function getRequestOptions(): AxiosRequestConfig;

export function getSanitizeHtmlOptions(): SanitizeOptions;

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

  /**
   * html-crush Optional Options Object
   * @see: https://codsen.com/os/html-crush/#api-crush-optional-options-object
   */
  htmlCrush: {
    lineLengthLimit: number
    removeIndentations: boolean
    removeLineBreaks: boolean
    removeHTMLComments: boolean | 0 | 1 | 2
    removeCSSComments: boolean
    reportProgressFunc: null | ((percDone: number) => void)
    reportProgressFuncFrom: number
    reportProgressFuncTo: number
    breakToTheLeftOf: string[]
    mindTheInlineTags: string[]
  }
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
