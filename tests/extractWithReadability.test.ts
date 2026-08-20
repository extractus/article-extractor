// tests/extractWithReadability.test.ts

import { assertEquals } from "@std/assert";
import { isString } from "@pwshub/bellajs";
import extractWithReadability from "../src/utils/extractWithReadability.ts";

Deno.test("extractWithReadability - good html content", () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = extractWithReadability(html, "https://foo.bar");
  assertEquals(isString(result?.content || ""), true);
  assertEquals((result?.content?.length || 0) > 200, true);
  assertEquals(
    result?.content?.includes('<img src="https://foo.bar/orange.png">'),
    true,
  );
});

Deno.test("extractWithReadability - bad html content", () => {
  assertEquals(extractWithReadability(null as unknown as string), null);
  assertEquals(extractWithReadability({} as unknown as string), null);
  assertEquals(extractWithReadability("<div></span>"), null);
});
