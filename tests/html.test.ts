// tests/html.test.ts

import { assertEquals } from "@std/assert";
import { isString } from "@pwshub/bellajs";
import { cleanify } from "../src/utils/html.ts";
import {
  defaultAllowedAttributes,
  defaultAllowedIframeDomains,
  defaultAllowedTags,
} from "../src/config.ts";

const defaults = {
  allowedTags: defaultAllowedTags,
  allowedAttributes: defaultAllowedAttributes,
  allowedIframeDomains: defaultAllowedIframeDomains,
};

Deno.test("cleanify - removes unwanted elements/attributes", () => {
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  assertEquals(
    html.includes("<address>4746 Kelly Drive, West Virginia</address>"),
    true,
  );
  assertEquals(
    html.includes('<img src="./orange.png" style="border: solid 1px #000">'),
    true,
  );
  const result = cleanify(html, defaults);
  assertEquals(isString(result), true);
  assertEquals(
    result.includes("<address>4746 Kelly Drive, West Virginia</address>"),
    false,
  );
  assertEquals(result.includes('style="border: solid 1px #000"'), false);
});
