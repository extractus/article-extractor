// Type definitions

export function extract(url: string): Promise<ArticleData>;

export function setParserOptions(props: object): void;
export function setNodeFetchOptions(props: object): void;
export function setSanitizeHtmlOptions(props: object): void;

export function getParserOptions(): object;
export function getNodeFetchOptions(): object;
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
