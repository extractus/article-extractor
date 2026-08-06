// utils -> extractWithReadability.ts

import { Readability } from "@mozilla/readability";
import { DOMParser } from "linkedom";
import { isString } from "@pwshub/bellajs";

export default (html: string, url = ""): string | null => {
  if (!isString(html)) {
    return null;
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const base = doc.createElement("base", {});
  base.setAttribute("href", url);
  doc.head.appendChild(base);
  const reader = new Readability(doc as unknown as Document, {
    keepClasses: true,
  });
  const result: Record<string, unknown> = reader.parse() ?? {};
  return result.textContent ? result.content as string : null;
};

export function extractTitleWithReadability(html: string): string | null {
  if (!isString(html)) {
    return null;
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const reader = new Readability(doc as unknown as Document);
  return (reader as any)._getArticleTitle() || null;
}
