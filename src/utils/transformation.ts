// utils -> transformation.ts

import { isArray, isFunction } from "@pwshub/bellajs";
import { DOMParser } from "linkedom";

export interface Transformation {
  patterns: RegExp[];
  pre?: (document: Document) => Document;
  post?: (document: Document) => Document;
}

const transformations: Transformation[] = [];

const add = (tn: Transformation): number => {
  const { patterns } = tn;
  if (!patterns || !isArray(patterns) || !patterns.length) {
    return 0;
  }
  transformations.push(tn);
  return 1;
};

/** Register one or more transformations for per-site HTML processing. */
export const addTransformations = (tfms: Transformation | Transformation[]): number => {
  if (isArray(tfms)) {
    return (tfms as Transformation[]).map((tfm) => add(tfm)).filter((result) => result === 1).length;
  }
  return add(tfms as Transformation);
};

/** Remove transformations matching the given patterns. Removes all if no patterns given. */
export const removeTransformations = (patterns?: RegExp[]): number => {
  if (!patterns) {
    const removed = transformations.length;
    transformations.length = 0;
    return removed;
  }
  let removing = 0;
  for (let i = transformations.length - 1; i >= 0; i--) {
    const { patterns: ipatterns } = transformations[i];
    const matched = ipatterns.some((ptn) =>
      (patterns as RegExp[]).some((pattern) => String(pattern) === String(ptn))
    );
    if (matched) {
      transformations.splice(i, 1);
      removing += 1;
    }
  }
  return removing;
};

export const getTransformations = (): Transformation[] => {
  return [...transformations];
};

export const findTransformations = (links: string | string[]): Transformation[] => {
  const urls = !isArray(links) ? [links] : links;
  const tfms: Transformation[] = [];
  for (const transformation of transformations) {
    const { patterns } = transformation;
    const matched = (urls as string[]).some((url) =>
      patterns.some((pattern) => pattern.test(url))
    );
    if (matched) {
      tfms.push({
        ...transformation,
      });
    }
  }
  return tfms;
};

export const execPreParser = (html: string, links: string | string[]): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  findTransformations(links).map((tfm) => tfm.pre).filter((fn) => isFunction(fn)).forEach((fn) => (fn as (doc: Document) => Document)(doc as any));
  return Array.from(doc.childNodes).map((it) => (it as Element).outerHTML).join("");
};

export const execPostParser = (html: string, links: string | string[]): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  findTransformations(links).map((tfm) => tfm.post).filter((fn) => isFunction(fn)).forEach((fn) => (fn as (doc: Document) => Document)(doc as any));
  return Array.from(doc.childNodes).map((it) => (it as Element).outerHTML).join("");
};
