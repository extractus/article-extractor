// tests/config.test.ts

import { assertEquals } from "@std/assert";
import { setSanitizeHtmlOptions, getSanitizeHtmlOptions } from "../src/config.ts";

Deno.test("setSanitizeHtmlOptions/getSanitizeHtmlOptions", () => {
  setSanitizeHtmlOptions({
    allowedTags: ["div", "span"],
    allowedAttributes: {
      a: ["href", "title"],
    },
  });

  const actual = getSanitizeHtmlOptions();
  const actualAllowedAttributes = actual.allowedAttributes as Record<string, string[]>;
  const expectedAllowedAttributes = {
    a: ["href", "title"],
  };

  assertEquals(actualAllowedAttributes, expectedAllowedAttributes);

  const actualAllowedTags = actual.allowedTags as string[];
  const expectedAllowedTags = ["div", "span"];
  assertEquals(actualAllowedTags, expectedAllowedTags);

  setSanitizeHtmlOptions({
    allowedTags: [],
  });

  assertEquals(getSanitizeHtmlOptions().allowedTags, []);
});
