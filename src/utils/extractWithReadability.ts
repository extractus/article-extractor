// utils -> extractWithReadability.ts

import { Readability } from "@mozilla/readability";
import { DOMParser } from "linkedom";

type ReadabilityOutput = {
  title: string;
  content: string;
  excerpt: string;
  byline: string;
  siteName: string;
  publishedTime: string;
};

export default (html: string, url = ""): ReadabilityOutput | null => {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const base = doc.createElement("base", {});
    base.setAttribute("href", url);
    doc.head.appendChild(base);
    const reader = new Readability(doc as unknown as Document, {
      nbTopCandidates: 4,
      charThreshold: 400,
      keepClasses: true,
    });
    const result = reader.parse();
    const charlen = result?.length || 0;
    const title = result?.title ?? "";
    const excerpt = result?.excerpt ?? "";
    const content = result?.content ?? "";
    const byline = result?.byline ?? "";
    const siteName = result?.siteName ?? "";
    const publishedTime = result?.publishedTime ?? "";
    return (!charlen || !title || !content) ? null : {
      title,
      content,
      excerpt,
      byline,
      siteName,
      publishedTime,
    };
  } catch {
    return null;
  }
};
