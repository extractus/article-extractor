// tests/extractMetaData.test.ts

import { assertEquals } from "@std/assert";
import { hasProperty, isObject } from "@pwshub/bellajs";
import extractMetaData from "../src/utils/extractMetaData.ts";

const keys =
  "url shortlink amphtml canonical title description image author source published favicon type"
    .split(" ");

function isDateString(date: unknown): boolean {
  if (typeof date !== "string") return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

Deno.test("extractMetaData - good content", () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = extractMetaData(html);
  assertEquals(isObject(result), true);
  keys.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
});

Deno.test("extractMetaData - json ld schema content", () => {
  const html = Deno.readTextFileSync(
    "tests/test-data/regular-article-json-ld.html",
  );
  const result = extractMetaData(html);
  assertEquals(isObject(result), true);
  keys.forEach((k) => {
    assertEquals(hasProperty(result, k), true);
  });
});

Deno.test("extractMetaData - json ld schema fills empty meta fields", () => {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    author: { name: "JSON Author" },
    datePublished: "2026-01-02T03:04:05Z",
    description: "JSON description",
    image: "https://example.com/json.jpg",
  };
  const body = "<p>" + "Article text. ".repeat(50) + "</p>";
  const html = `<html><head>
<title>Fixture article</title>
<script type="application/ld+json">${JSON.stringify(ldJson)}</script>
</head><body><article><h1>Fixture article</h1>${body}</article></body></html>`;
  const result = extractMetaData(html);
  assertEquals(result.author, "JSON Author");
  assertEquals(result.published, "2026-01-02T03:04:05Z");
  assertEquals(result.description, "JSON description");
  assertEquals(result.image, "https://example.com/json.jpg");
});

Deno.test("extractMetaData - find date", () => {
  const html1 = Deno.readTextFileSync(
    "tests/test-data/regular-article-date-time.html",
  );
  const html2 = Deno.readTextFileSync(
    "tests/test-data/regular-article-date-itemprop.html",
  );
  const html3 = Deno.readTextFileSync(
    "tests/test-data/regular-article-date-span.html",
  );
  const result1 = extractMetaData(html1);
  const result2 = extractMetaData(html2);
  const result3 = extractMetaData(html3);
  assertEquals(isObject(result1), true);
  assertEquals(isObject(result2), true);
  assertEquals(isObject(result3), true);
  keys.forEach((k) => {
    assertEquals(hasProperty(result1, k), true);
    assertEquals(hasProperty(result2, k), true);
    assertEquals(hasProperty(result3, k), true);
  });
  assertEquals(isDateString(result1.published), true);
  assertEquals(isDateString(result2.published), true);
  assertEquals(isDateString(result3.published), true);
});
