// tests/config.test.ts

import { assertEquals } from "@std/assert";
import {
  defaultAllowedAttributes,
  defaultAllowedIframeDomains,
  defaultAllowedTags,
} from "../src/config.ts";

Deno.test("defaultAllowedTags - contains expected tags", () => {
  assertEquals(defaultAllowedTags.includes("a"), true);
  assertEquals(defaultAllowedTags.includes("img"), true);
  assertEquals(defaultAllowedTags.includes("p"), true);
  assertEquals(defaultAllowedTags.includes("script"), false);
  assertEquals(defaultAllowedTags.includes("style"), false);
});

Deno.test("defaultAllowedAttributes - contains expected attributes", () => {
  assertEquals(defaultAllowedAttributes.a, ["href", "target", "title"]);
  assertEquals(defaultAllowedAttributes.img, ["src", "srcset", "alt", "title"]);
  assertEquals(defaultAllowedAttributes.iframe, [
    "src",
    "frameborder",
    "height",
    "width",
    "scrolling",
    "allow",
  ]);
});

Deno.test("defaultAllowedIframeDomains - contains expected domains", () => {
  assertEquals(defaultAllowedIframeDomains.includes("youtube.com"), true);
  assertEquals(defaultAllowedIframeDomains.includes("vimeo.com"), true);
  assertEquals(defaultAllowedIframeDomains.includes("evil.com"), false);
});
