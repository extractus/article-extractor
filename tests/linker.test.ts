// tests/linker.test.ts

import { assertEquals } from "@std/assert";
import { isString } from "@pwshub/bellajs";
import {
  chooseBestUrl,
  isValid as isValidUrl,
  purify as purifyUrl,
  normalize as normalizeUrls,
  absolutify as absolutifyUrl,
} from "../src/utils/linker.ts";

Deno.test("isValidUrl - valid URLs", () => {
  assertEquals(isValidUrl("https://www.23hq.com"), true);
  assertEquals(isValidUrl("https://secure.actblue.com"), true);
  assertEquals(isValidUrl("https://docs.microsoft.com/en-us/azure/iot-edge/quickstart?view=iotedge-2018-06"), true);
  assertEquals(isValidUrl("http://192.168.1.199:8081/example/page"), true);
});

Deno.test("isValidUrl - invalid URLs", () => {
  assertEquals(isValidUrl("ftp://192.168.1.199:8081/example/page"), false);
  assertEquals(isValidUrl(""), false);
  assertEquals(isValidUrl(null as unknown as string), false);
  assertEquals(isValidUrl({ a: "x" } as unknown as string), false);
});

Deno.test("normalizeUrls - adds absolute URLs and target=_blank", () => {
  const bestUrl = "https://test-url.com/burritos-for-life";
  const html = Deno.readTextFileSync("tests/test-data/regular-article.html");
  const result = normalizeUrls(html, bestUrl);
  assertEquals(isString(result), true);
  assertEquals(result.includes('<a href="/dict/watermelon">watermelon</a>'), false);
  assertEquals(result.includes('<a target="_blank" href="https://test-url.com/dict/watermelon">watermelon</a>'), true);
  assertEquals(result.includes('<a href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'), false);
  assertEquals(result.includes('<a target="_blank" href="https://otherwhere.com/descriptions/rational-peach">rational peach</a>'), true);
});

Deno.test("purifyUrl - various cases", () => {
  assertEquals(purifyUrl(""), null);
  assertEquals(purifyUrl({} as unknown as string), null);
  assertEquals(purifyUrl("https://some.where/article/abc-xyz"), "https://some.where/article/abc-xyz");
  assertEquals(purifyUrl("https://some.where/article/abc-xyz#name,bob"), "https://some.where/article/abc-xyz");
  assertEquals(purifyUrl("https://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer"), "https://some.where/article/abc-xyz");
  assertEquals(purifyUrl("https://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer"), "https://some.where/article/abc-xyz?q=3");
  assertEquals(purifyUrl("https://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer"), "https://some.where/article/abc-xyz");
  assertEquals(purifyUrl("https://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer"), "https://some.where/article/abc-xyz?q=3");
});

Deno.test("absolutifyUrl - various cases", () => {
  assertEquals(absolutifyUrl("", ""), "");
  assertEquals(absolutifyUrl("", {} as unknown as string), "");
  assertEquals(absolutifyUrl("https://some.where/article/abc-xyz", "category/page.html"), "https://some.where/article/category/page.html");
  assertEquals(absolutifyUrl("https://some.where/article/abc-xyz", "../category/page.html"), "https://some.where/category/page.html");
  assertEquals(absolutifyUrl("https://some.where/blog/authors/article/abc-xyz", "/category/page.html"), "https://some.where/category/page.html");
  assertEquals(absolutifyUrl("https://some.where/article/abc-xyz"), "https://some.where/article/abc-xyz");
});

Deno.test("chooseBestUrl - actual case", () => {
  const title = "Google đã ra giá mua Fitbit";
  const urls = [
    "https://alpha.xyz/tin-tuc-kinh-doanh/-/view_content/content/2965950/google-da-ra-gia-mua-fitbit",
    "https://alpha.xyz/tin-tuc-kinh-doanh/view/2965950/907893219797",
    "https://alpha.xyz/tin-tuc-kinh-doanh/google-da-ra-gia-mua-fitbit",
    "https://a.xyz/read/google-da-ra-gia-mua-fitbit",
    "https://a.xyz/read/2965950/907893219797",
  ];
  const result = chooseBestUrl(urls, title);
  assertEquals(result, urls[3]);
});
