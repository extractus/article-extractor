// utils -> parseFromHtml.ts

import {
  getTTR,
  pipe,
  stripTags,
  truncateByChar,
  unique,
} from "@pwshub/bellajs";

import { cleanify, countImages } from "./html.ts";

import {
  absolutify as absolutifyUrl,
  chooseBestUrl,
  getDomain,
  isValid as isValidUrl,
  normalize as normalizeUrls,
  purify as purifyUrl,
} from "./linker.ts";

import extractMetaData from "./extractMetaData.ts";

import extractWithReadability, {
  extractTitleWithReadability,
} from "./extractWithReadability.ts";

import { execPostParser, execPreParser } from "./transformation.ts";

import {
  defaultAllowedAttributes,
  defaultAllowedIframeDomains,
  defaultAllowedTags,
} from "../config.ts";

import type { ArticleData, ParserOptions } from "../main.ts";

const summarize = (
  { desc, text, threshold, maxlen }: {
    desc: string;
    text: string;
    threshold: number;
    maxlen: number;
  },
): string => {
  return desc.length > threshold
    ? desc
    : truncateByChar(text, maxlen).replace(/\n/g, " ");
};

// deno-lint-ignore require-await
export default async (
  inputHtml: string,
  inputUrl = "",
  parserOptions: ParserOptions = {},
): Promise<ArticleData | null> => {
  const meta = extractMetaData(inputHtml);

  let title = meta.title;

  const {
    url,
    shortlink,
    amphtml,
    canonical,
    description: metaDesc,
    image: metaImg,
    author,
    published,
    favicon: metaFav,
    type,
  } = meta;

  const {
    wordsPerMinute = 300,
    descriptionTruncateLen = 210,
    descriptionLengthThreshold = 180,
    contentLengthThreshold = 200,
    allowedTags = defaultAllowedTags,
    allowedAttributes = defaultAllowedAttributes,
    allowedIframeDomains = defaultAllowedIframeDomains,
  } = parserOptions;

  if (!title) {
    title = extractTitleWithReadability(inputHtml) || "";
  }
  if (!title) {
    return null;
  }

  const links = unique(
    [url, shortlink, amphtml, canonical, inputUrl]
      .filter(isValidUrl)
      .map(purifyUrl as (s: string) => string),
  );

  if (!links.length) {
    return null;
  }

  const bestUrl = chooseBestUrl(links, title);

  const fns = pipe(
    (input: string) => {
      return normalizeUrls(input, bestUrl);
    },
    (input: string) => {
      return execPreParser(input, links);
    },
    (input: string) => {
      return extractWithReadability(input, bestUrl);
    },
    (input: string | null) => {
      return input ? execPostParser(input, links) : null;
    },
    (input: string | null) => {
      return input
        ? cleanify(input, {
          allowedTags,
          allowedAttributes,
          allowedIframeDomains,
        })
        : null;
    },
  );

  const content = fns(inputHtml);

  if (!content) {
    return null;
  }

  const textContent = stripTags(content);
  if (textContent.length < contentLengthThreshold) {
    return null;
  }

  const description = summarize({
    desc: metaDesc,
    text: textContent,
    threshold: descriptionLengthThreshold,
    maxlen: descriptionTruncateLen,
  });

  const image = metaImg ? absolutifyUrl(bestUrl, metaImg) : "";
  const favicon = metaFav ? absolutifyUrl(bestUrl, metaFav) : "";

  const imgcount = countImages(content);

  return {
    url: bestUrl,
    title,
    description,
    links,
    image,
    content,
    author,
    favicon,
    source: getDomain(bestUrl),
    published,
    ttr: getTTR(textContent, imgcount, wordsPerMinute),
    type,
  };
};
