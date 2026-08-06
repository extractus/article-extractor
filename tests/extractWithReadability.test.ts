// tests/extractWithReadability.test.ts

import { assertEquals } from "@std/assert";
import { isString } from "@pwshub/bellajs";
import extractWithReadability, { extractTitleWithReadability } from "../src/utils/extractWithReadability.ts";

Deno.test("extractWithReadability - good html content", () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = extractWithReadability(html, "https://foo.bar");
  assertEquals(isString(result), true);
  assertEquals((result as string).length > 200, true);
  assertEquals((result as string).includes('<img src="https://foo.bar/orange.png">'), true);
});

Deno.test("extractWithReadability - bad html content", () => {
  assertEquals(extractWithReadability(null as unknown as string), null);
  assertEquals(extractWithReadability({} as unknown as string), null);
  assertEquals(extractWithReadability("<div></span>"), null);
});

Deno.test("extractTitleWithReadability - good content", () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = extractTitleWithReadability(html);
  assertEquals(result, "Article title here - ArticleParser");
});

Deno.test("extractTitleWithReadability - page without title", () => {
  const html = Deno.readTextFileSync("tests/test-data/html-no-title.html");
  const result = extractTitleWithReadability(html);
  assertEquals(result, null);
});

Deno.test("extractTitleWithReadability - non-string", () => {
  const result = extractTitleWithReadability({} as unknown as string);
  assertEquals(result, null);
});
