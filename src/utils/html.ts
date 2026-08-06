// utils -> html.ts

import { DOMParser } from "linkedom";
import sanitize from "sanitize-html";
import { pipe } from "@pwshub/bellajs";

import { getSanitizeHtmlOptions } from "../config.ts";

export const purify = (html: string): string => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
  });
};

// deno-lint-ignore no-control-regex
const WS_REGEXP = /^[\s\f\n\r\t\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\x09\x0a\x0b\x0c\x0d\x20\xa0]+$/;

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
    charset = h ? h.getAttribute("content")?.split(";")[1]?.replace("charset=", "")?.trim() : "";
  }
  return charset?.toLowerCase() || "utf8";
};

export const cleanify = (inputHtml: string): string => {
  const doc = new DOMParser().parseFromString(inputHtml, "text/html");
  const html = doc.documentElement.innerHTML;
  return pipe(
    (input: string) => sanitize(input, getSanitizeHtmlOptions() as sanitize.IOptions),
    (input: string) => stripMultiLinebreaks(input),
    (input: string) => stripMultispaces(input),
  )(html);
};

export const countImages = (html: string): number => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgTags = doc.querySelectorAll("img") || [];
  return imgTags.length;
};
