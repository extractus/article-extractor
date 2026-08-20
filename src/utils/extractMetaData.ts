// utils -> extractMetaData.ts

import { DOMParser } from "linkedom";
import extractLdSchema from "./extractLdSchema.ts";
import findDate from "./findDate.ts";

function getMetaContentByNameOrProperty(
  node: Element,
  attributeLists: Record<string, string[]>,
): { key: string; content: string } | null {
  const content = node.getAttribute("content");
  if (!content) return null;

  const property = node
    .getAttribute("property")?.toLowerCase() ??
    node.getAttribute("itemprop")?.toLowerCase();

  const name = node.getAttribute("name")?.toLowerCase();

  for (const [key, attrs] of Object.entries(attributeLists)) {
    if (attrs.includes(property || "") || attrs.includes(name || "")) {
      return { key, content };
    }
  }

  return null;
}

export default (html: string): Record<string, string> => {
  const entry: Record<string, string> = {
    url: "",
    shortlink: "",
    amphtml: "",
    canonical: "",
    title: "",
    description: "",
    image: "",
    author: "",
    source: "",
    published: "",
    favicon: "",
    type: "",
  };

  const sourceAttrs = [
    "application-name",
    "og:site_name",
    "twitter:site",
    "dc.title",
  ];
  const urlAttrs = [
    "og:url",
    "twitter:url",
    "parsely-link",
  ];
  const titleAttrs = [
    "title",
    "og:title",
    "twitter:title",
    "parsely-title",
  ];
  const descriptionAttrs = [
    "description",
    "og:description",
    "twitter:description",
    "parsely-description",
  ];
  const imageAttrs = [
    "image",
    "og:image",
    "og:image:url",
    "og:image:secure_url",
    "twitter:image",
    "twitter:image:src",
    "parsely-image-url",
  ];
  const authorAttrs = [
    "author",
    "creator",
    "og:creator",
    "article:author",
    "twitter:creator",
    "dc.creator",
    "parsely-author",
  ];
  const publishedTimeAttrs = [
    "article:published_time",
    "article:modified_time",
    "og:updated_time",
    "dc.date",
    "dc.date.issued",
    "dc.date.created",
    "dc:created",
    "dcterms.date",
    "datepublished",
    "datemodified",
    "updated_time",
    "modified_time",
    "published_time",
    "release_date",
    "date",
    "parsely-pub-date",
  ];
  const typeAttrs = [
    "og:type",
  ];

  const attributeLists: Record<string, string[]> = {
    source: sourceAttrs,
    url: urlAttrs,
    title: titleAttrs,
    description: descriptionAttrs,
    image: imageAttrs,
    author: authorAttrs,
    published: publishedTimeAttrs,
    type: typeAttrs,
  };

  const doc = new DOMParser().parseFromString(html, "text/html");
  entry.title = doc.querySelector("head > title")?.textContent || "";

  Array.from(doc.getElementsByTagName("link")).forEach((node) => {
    const rel = node.getAttribute("rel");
    const href = node.getAttribute("href");
    if (rel && href) {
      entry[rel] = href;
      if (rel === "icon" || rel === "shortcut icon") {
        entry.favicon = href;
      }
    }
  });

  Array.from(doc.getElementsByTagName("meta")).forEach((node) => {
    const result = getMetaContentByNameOrProperty(node, attributeLists);
    const val = result?.content || "";
    if (val !== "" && result) {
      entry[result.key] = val;
    }
  });

  const metadata = extractLdSchema(doc as unknown as Document, entry);

  if (!metadata.published) {
    metadata.published = findDate(doc as unknown as Document) || "";
  }

  return metadata;
};
