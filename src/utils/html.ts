// utils -> html.ts

import { DOMParser } from "linkedom";

export interface SanitizeOptions {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedIframeDomains: string[];
}

const WS_REGEXP =
  /^[\s\f\n\r\t\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\x09\x0a\x0b\x0c\x0d\x20\xa0]+$/;

const stripMultiLinebreaks = (str: string): string => {
  return str.replace(/(\r\n|\n|\u2424){2,}/g, "\n").split("\n").map((line) => {
    return WS_REGEXP.test(line) ? line.trim() : line;
  }).filter((line) => {
    return line.length > 0;
  }).join("\n");
};

const stripMultispaces = (str: string): string => {
  return str.replace(WS_REGEXP, " ").trim();
};

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

  return stripMultiLinebreaks(stripMultispaces(doc.documentElement.innerHTML));
};

export const countImages = (html: string): number => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgTags = doc.querySelectorAll("img") || [];
  return imgTags.length;
};
