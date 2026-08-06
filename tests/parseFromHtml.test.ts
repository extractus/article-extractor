// tests/parseFromHtml.test.ts

import { assertEquals } from "@std/assert";
import { extractFromHtml as parseFromHtml } from "../src/main.ts";
import { addTransformations, removeTransformations } from "../src/utils/transformation.ts";

const expDesc = [
  "Navigation here Few can name a rational peach that isn't a conscientious goldfish!",
  "One cannot separate snakes from plucky pomegranates?",
  "Draped neatly on a hanger, the melons could be said to resemble knowledgeable pigs.",
].join(" ");

Deno.test("parseFromHtml - webpage with no title", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-no-title.html");
  const result = await parseFromHtml(html);
  assertEquals(result, null);
});

Deno.test("parseFromHtml - webpage without link", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-no-link.html");
  const result = await parseFromHtml(html);
  assertEquals(result, null);
});

Deno.test("parseFromHtml - webpage with no main article", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-no-article.html");
  const result = await parseFromHtml(html);
  assertEquals(result, null);
});

Deno.test("parseFromHtml - webpage with very short article", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-too-short-article.html");
  const result = await parseFromHtml(html, "abcd");
  assertEquals(result, null);
});

Deno.test("parseFromHtml - webpage with article but no source", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-article-no-source.html");
  const result = await parseFromHtml(html);
  assertEquals((result as Record<string, unknown>).source, "somewhere.any");
});

Deno.test("parseFromHtml - webpage with data-src in img tag", async () => {
  const html = Deno.readTextFileSync("tests/test-data/html-article-with-data-src.html");
  const result = await parseFromHtml(html);
  assertEquals((result as Record<string, string>).content.includes('<img src="https://somewhere.any/image1.jpg" />'), true);
  assertEquals((result as Record<string, string>).content.includes('<img src="https://somewhere.any/image2.jpg" />'), true);
});

Deno.test("parseFromHtml - regular article", async () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = await parseFromHtml(html, "https://somewhere.com/path/to/article");
  assertEquals((result as Record<string, unknown>).title, "Article title here");
  assertEquals((result as Record<string, unknown>).description, expDesc);
  assertEquals((result as Record<string, string>).content.includes('<a target="_blank" href="https://otherwhere.com/descriptions/rational-peach">'), true);
  assertEquals((result as Record<string, string>).content.includes('<a target="_blank" href="https://somewhere.com/dict/watermelon">'), true);
});

Deno.test("parseFromHtml - multi transforms", async () => {
  addTransformations([
    {
      patterns: [
        /http(s?):\/\/need-transform.tld\/*/,
      ],
      post: (document: Document) => {
        document.querySelectorAll("a").forEach((node: Element) => {
          const sHtml = node.innerHTML;
          const link = node.getAttribute("href");
          node.parentNode!.replaceChild(document.createTextNode(`[link url="${link}"]${sHtml}[/link]`), node);
        });
        return document;
      },
    },
    {
      patterns: [
        /http(s?):\/\/sw.re\/*/,
      ],
      post: (document: Document) => {
        document.querySelectorAll("strong").forEach((node: Element) => {
          const b = document.createElement("B");
          b.innerHTML = node.innerHTML;
          node.parentNode!.replaceChild(b, node);
        });
        return document;
      },
    },
  ]);
  const html = Deno.readTextFileSync("tests/test-data/vnn-article.html");
  const url = "https://need-transform.tld/path/to/article";
  const result = await parseFromHtml(html, url);
  assertEquals((result as Record<string, unknown>).title, "Article title here");
  assertEquals((result as Record<string, string>).content.includes('<a href="https://vnn.vn/dict/watermelon" target="_blank">'), false);
  assertEquals((result as Record<string, string>).content.includes('[link url="https://vnn.vn/dict/watermelon"]watermelon[/link]'), true);
  assertEquals((result as Record<string, string>).content.includes("<b>in its own way</b>"), true);
  removeTransformations();
});
