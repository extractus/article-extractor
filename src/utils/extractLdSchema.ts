// utils -> extractLdSchema.ts

import { isArray, isObject, isString } from "@pwshub/bellajs";

const typeSchemas = [
  "aboutpage",
  "checkoutpage",
  "collectionpage",
  "contactpage",
  "faqpage",
  "itempage",
  "medicalwebpage",
  "profilepage",
  "qapage",
  "realestatelisting",
  "searchresultspage",
  "webpage",
  "website",
  "article",
  "advertisercontentarticle",
  "newsarticle",
  "analysisnewsarticle",
  "askpublicnewsarticle",
  "backgroundnewsarticle",
  "opinionnewsarticle",
  "reportagenewsarticle",
  "reviewnewsarticle",
  "report",
  "satiricalarticle",
  "scholarlyarticle",
  "medicalscholarlyarticle",
];

const attributeLists: Record<string, string> = {
  description: "description",
  image: "image",
  author: "author",
  published: "datePublished",
  type: "@type",
};

const parseJson = (text: string): Record<string, unknown> => {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const isAllowedLdJsonType = (ldJson: Record<string, unknown>): boolean => {
  const rootLdJsonType = ldJson["@type"] || "";
  const arr = isArray(rootLdJsonType) ? rootLdJsonType as string[] : [rootLdJsonType as string];
  const ldJsonTypes = arr.filter((x) => !!x);
  return ldJsonTypes.length > 0 && ldJsonTypes.some((x) => typeSchemas.includes(x.toLowerCase()));
};

export default (document: Document, entry: Record<string, string>): Record<string, string> => {
  const ldSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  ldSchemas.forEach((ldSchema: Element) => {
    const ldJson = parseJson(ldSchema.textContent.replace(/[\n\r\t]/g, ""));
    if (ldJson && isAllowedLdJsonType(ldJson)) {
      for (const [key, attr] of Object.entries(attributeLists)) {
        if (entry[key] || !ldJson[attr]) {
          continue;
        }

        const keyValue = ldJson[attr];
        const val = isArray(keyValue) ? (keyValue as unknown[])[0] : isObject(keyValue) ? (keyValue as Record<string, unknown>)?.name || "" : keyValue;
        if (isString(val) && val !== "") {
          entry[key] = (val as string).trim();
        }
      }
    }
  });

  return entry;
};
