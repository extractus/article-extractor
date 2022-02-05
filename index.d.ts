// Type definitions

export interface QueryRule {
    patterns: Array<RegExp>,
    unwanted?: Array<String>,
    selector?: String
}

export function extract(url: string): Promise<ArticleData>;

export function setParserOptions(props: object): void;
export function setRequestOptions(props: object): void;
export function setSanitizeHtmlOptions(props: object): void;
export function addQueryRules(entries: Array<QueryRule>): Number;

export function getParserOptions(): object;
export function getRequestOptions(): object;
export function getSanitizeHtmlOptions(): object;

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
