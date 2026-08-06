// tests/main.test.ts

import { assertEquals, assertRejects } from "@std/assert";
import { extract } from "../src/main.ts";
import {
  defaultAllowedAttributes,
  defaultAllowedIframeDomains,
  defaultAllowedTags,
} from "../src/config.ts";
import { createMockFetcher } from "./helpers.ts";

Deno.test("extract - non-string input", async () => {
  await assertRejects(
    () => extract({} as unknown as string),
    Error,
    "Input must be a string",
  );
});

Deno.test("extract - bad urls", async () => {
  const badSamples = [
    "htt:/abc.com/failed-none-sense",
    "fpt://abc.com/failed-none-sense",
    "ttp://badcom/146753785",
    "https://674458092126388225",
  ];

  for (const url of badSamples) {
    await assertRejects(
      () => extract(url),
      Error,
    );
  }
});

Deno.test("extract - regular article from url", async () => {
  const expDesc = [
    "Navigation here Few can name a rational peach that isn't a conscientious goldfish!",
    "One cannot separate snakes from plucky pomegranates?",
    "Draped neatly on a hanger, the melons could be said to resemble knowledgeable pigs.",
  ].join(" ");

  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const fetcher = createMockFetcher(html, "text/html");
  const result = await extract(
    "https://somewhere.com/path/to/article",
    {},
    fetcher,
  );
  assertEquals((result as Record<string, unknown>).title, "Article title here");
  assertEquals((result as Record<string, unknown>).description, expDesc);
});

Deno.test("extract - no article from url", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-no-article.html");
  const fetcher = createMockFetcher(html, "text/html");
  const result = await extract(
    "https://somewhere.com/path/to/no/article",
    {},
    fetcher,
  );
  assertEquals(result, null);
});

Deno.test("extract - empty content from url", async () => {
  const fetcher = createMockFetcher("", "text/html");
  const result = await extract(
    "https://somewhere.com/path/to/no/content",
    {},
    fetcher,
  );
  assertEquals(result, null);
});

Deno.test("extract - html string directly", async () => {
  const expDesc = [
    "Navigation here Few can name a rational peach that isn't a conscientious goldfish!",
    "One cannot separate snakes from plucky pomegranates?",
    "Draped neatly on a hanger, the melons could be said to resemble knowledgeable pigs.",
  ].join(" ");

  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = await extract(html);
  assertEquals((result as Record<string, unknown>).title, "Article title here");
  assertEquals((result as Record<string, unknown>).description, expDesc);
});

Deno.test("extract with custom allowed attributes via ParserOptions", async () => {
  const html = Deno.readTextFileSync(
    "tests/test-data/article-with-classes-attributes.html",
  );
  const result = await extract(html, {
    allowedTags: defaultAllowedTags,
    allowedAttributes: {
      ...defaultAllowedAttributes,
      code: ["class"],
      div: ["class"],
    },
    allowedIframeDomains: defaultAllowedIframeDomains,
  });
  assertEquals(
    (result as Record<string, string>).content.includes('code class="lang-js"'),
    true,
  );
});
