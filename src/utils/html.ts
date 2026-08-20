// utils -> html.ts

import { DOMParser } from "linkedom";

export interface SanitizeOptions {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedIframeDomains: string[];
}

const cleanWhitespace = (str: string): string =>
  str
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/^ | $/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

export const isHTML = (value: string): boolean =>
  /<\/?[a-z][^>]*>/i.test(value);

export const getCharset = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const m = doc.querySelector("meta[charset]") || null;
  let charset = m ? m.getAttribute("charset") : "";
  if (!charset) {
    const h = doc.querySelector('meta[http-equiv="content-type"]') || null;
    charset = h
      ? h.getAttribute("content")?.split(";")[1]?.replace("charset=", "")
        ?.trim()
      : "";
  }
  return charset?.toLowerCase() || "utf8";
};

export const cleanify = (
  inputHtml: string,
  options: SanitizeOptions,
): string => {
  const { allowedTags, allowedAttributes, allowedIframeDomains } = options;
  const tagSet = new Set(allowedTags.map((t) => t.toLowerCase()));
  const doc = new DOMParser().parseFromString(inputHtml, "text/html");

  const sanitize = (node: ChildNode) => {
    if (node.nodeType !== 1) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (!tagSet.has(tag)) {
      el.parentNode?.removeChild(el);
      return;
    }

    if (tag === "iframe") {
      const src = el.getAttribute("src") || "";
      try {
        const hostname = new URL(src).hostname.replace(/^www\./, "");
        const allowed = allowedIframeDomains.some((d) =>
          hostname === d || hostname.endsWith("." + d)
        );
        if (!allowed) {
          el.parentNode?.removeChild(el);
          return;
        }
      } catch {
        el.parentNode?.removeChild(el);
        return;
      }
    }

    const allowed = allowedAttributes[tag];
    const allowedSet = allowed ? new Set(allowed) : null;
    for (let i = el.attributes.length - 1; i >= 0; i--) {
      const attr = el.attributes[i];
      if (!allowedSet || !allowedSet.has(attr.name)) {
        el.removeAttribute(attr.name);
      }
    }

    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitize(child);
    }
  };

  const children = Array.from(doc.documentElement.childNodes);
  for (const child of children) {
    sanitize(child);
  }

  return cleanWhitespace(doc.documentElement.innerHTML);
};

export const countImages = (html: string): number => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgTags = doc.querySelectorAll("img") || [];
  return imgTags.length;
};
