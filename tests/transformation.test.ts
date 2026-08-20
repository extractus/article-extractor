// tests/transformation.test.ts

import { assertEquals } from "@std/assert";
import {
  addTransformations,
  execPostParser,
  execPreParser,
  findTransformations,
  getTransformations,
  removeTransformations,
} from "../src/utils/transformation.ts";

Deno.test("add one transformation object", () => {
  const result = addTransformations({
    patterns: [
      /http(s?):\/\/([\w]+.)?def.tld\/*/,
    ],
    pre: (document: Document) => {
      return document;
    },
    post: (document: Document) => {
      return document;
    },
  });
  assertEquals(result, 1);
});

Deno.test("add multi transformation object", () => {
  const result = addTransformations([
    {
      patterns: [
        /http(s?):\/\/google.com\/*/,
        /http(s?):\/\/goo.gl\/*/,
      ],
    },
    {
      patterns: [
        /http(s?):\/\/goo.gl\/*/,
        /http(s?):\/\/google.inc\/*/,
      ],
    },
  ]);
  assertEquals(result, 2);
});

Deno.test("add transformation object without patterns", () => {
  const result = addTransformations({
    patterns: [],
    pre: (document: Document) => {
      return document;
    },
    post: (document: Document) => {
      return document;
    },
  });
  assertEquals(result, 0);
});

Deno.test("add transformation object without valid patterns", () => {
  const result = addTransformations({
    patterns: 123 as unknown as RegExp[],
    pre: (document: Document) => {
      return document;
    },
    post: (document: Document) => {
      return document;
    },
  });
  assertEquals(result, 0);
});

Deno.test("get all transformations", () => {
  const result = getTransformations();
  assertEquals(result.length, 3);
  assertEquals(
    String(result[0].patterns[0]),
    String(/http(s?):\/\/([\w]+.)?def.tld\/*/),
  );
});

Deno.test("remove one transformation", () => {
  addTransformations([
    {
      patterns: [
        /http(s?):\/\/abc.com\/*/,
        /http(s?):\/\/def.gl\/*/,
      ],
    },
    {
      patterns: [
        /http(s?):\/\/hik.gl\/*/,
        /http(s?):\/\/lmn.inc\/*/,
      ],
    },
    {
      patterns: [
        /http(s?):\/\/opq.gl\/*/,
        /http(s?):\/\/rst.inc\/*/,
      ],
    },
  ]);
  const result = removeTransformations([
    /http(s?):\/\/goo.gl\/*/,
  ]);
  assertEquals(result, 2);
});

Deno.test("get all transformations again", () => {
  const result = getTransformations();
  assertEquals(result.length, 4);
  assertEquals(
    String(result[3].patterns[1]),
    String(/http(s?):\/\/rst.inc\/*/),
  );
});

Deno.test("find transformations", () => {
  addTransformations([
    {
      patterns: [
        /http(s?):\/\/def.gl\/*/,
        /http(s?):\/\/uvw.inc\/*/,
      ],
    },
  ]);
  const notFound = findTransformations([
    "https://goo.gl/docs/article.html",
  ]);
  assertEquals(notFound.length, 0);

  const foundOne = findTransformations([
    "https://lmn.inc/docs/article.html",
  ]);
  assertEquals(foundOne.length, 1);

  const foundTwo = findTransformations([
    "https://def.gl/docs/article.html",
  ]);
  assertEquals(foundTwo.length, 2);
});

Deno.test("execPreParser", () => {
  addTransformations([
    {
      patterns: [
        /http(s?):\/\/xyz.com\/*/,
      ],
      pre: (doc: Document) => {
        doc.querySelectorAll(".adv").forEach((element: Element) => {
          element.parentNode!.removeChild(element);
        });
        return doc;
      },
    },
  ]);
  const html = `
      <div>
        hi <b>user</b>, this is an advertisement element
        <div class="adv">free product now!</div>
      </div>
    `;
  const result = execPreParser(html, "https://xyz.com/article");
  assertEquals(
    result.includes("hi <b>user</b>, this is an advertisement element"),
    true,
  );
  assertEquals(
    result.includes('<div class="adv">free product now!</div>'),
    false,
  );
});

Deno.test("execPostParser", () => {
  addTransformations([
    {
      patterns: [
        /http(s?):\/\/xyz.com\/*/,
      ],
      post: (doc: Document) => {
        doc.querySelectorAll("b").forEach((element: Element) => {
          const itag = doc.createElement("i");
          itag.innerHTML = element.innerHTML;
          element.parentNode!.replaceChild(itag, element);
        });
        return doc;
      },
    },
  ]);
  const html = `
      <div>
        hi <b>user</b>,
        <p>Thank you for your feedback!</p>
      </div>
    `;
  const result = execPostParser(html, "https://xyz.com/article");
  assertEquals(result.includes("<i>user</i>"), true);
  assertEquals(result.includes("<b>user</b>"), false);
});

Deno.test("remove all transformations", () => {
  const result = removeTransformations();
  assertEquals(result, 7);
  assertEquals(getTransformations().length, 0);
});
