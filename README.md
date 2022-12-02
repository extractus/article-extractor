# @extractus/article-extractor

Extract main article, main image and meta data from URL.

![CI test](https://github.com/extractus/article-extractor/workflows/ci-test/badge.svg)
![CodeQL](https://github.com/extractus/article-extractor/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Intro

*article-extractor* is a part of tool sets for content builder:

- [feed-extractor](https://github.com/extractus/feed-extractor): extract & normalize RSS/ATOM/JSON feed
- [article-extractor](https://github.com/extractus/article-extractor): extract main article from given URL
- [oembed-extractor](https://github.com/extractus/oembed-extractor): extract oEmbed data from supported providers

You can use one or combination of these tools to build news sites, create automated content systems for marketing campaign or gather dataset for NLP projects...

### Attention

`article-parser` has been renamed to `@extractus/article-extractor` since v7.2.5

## Demo

- [Give it a try!](https://extractor-demos.pages.dev/article-extractor)
- [Example FaaS](https://extractus.deno.dev/extract?apikey=rn0wbHos2e73W6ghQf705bdF&type=article&url=https://github.blog/2022-11-17-octoverse-2022-10-years-of-tracking-open-source/)


## Install & Usage

### Node.js

```bash
npm i @extractus/article-extractor

# pnpm
pnpm i @extractus/article-extractor

# yarn
yarn add @extractus/article-extractor
```

```ts
// es6 module
import { extract } from '@extractus/article-extractor'

// CommonJS
const { extract } = require('@extractus/article-extractor')

// or specify exactly path to CommonJS variant
const { extract } = require('@extractus/article-extractor/dist/cjs/article-extractor.js')
```

### Deno

```ts
// deno > 1.28
import { extract } from 'npm:@extractus/article-extractor'

// deno < 1.28
// import { extract } from 'https://esm.sh/@extractus/article-extractor'
```

### Browser

```ts
import { read } from 'https://unpkg.com/@extractus/article-extractor@latest/dist/article-extractor.esm.js'
```

Please check [the examples](examples) for reference.


### Deta cloud

For [Deta](https://www.deta.sh/) devs please refer [the source code and guideline here](https://github.com/ndaidong/article-parser-deta) or simply click the button below.

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/ndaidong/article-parser-deta)


## APIs

- [extract()](#extract)
- [Transformations](#transformations)
  - [`transformation` object](#transformation-object)
  - [.addTransformations](#addtransformationsobject-transformation--array-transformations)
  - [.removeTransformations](#removetransformationsarray-patterns)
  - [Priority order](#priority-order)
- [`sanitize-html`'s options](#sanitize-htmls-options)

---

### `extract()`

Load and extract article data. Return a Promise object.

#### Syntax

```ts
extract(String input)
extract(String input, Object parserOptions)
extract(String input, Object parserOptions, Object fetchOptions)
```

#### Parameters

##### `input` *required*

URL string links to the article or HTML content of that web page.

For example:

```js
import { extract } from '@extractus/article-extractor'

const input = 'https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html'
extract(input)
  .then(article => console.log(article))
  .catch(err => console.error(err))
```

The result - `article` - can be `null` or an object with the following structure:

```ts
{
  url: String,
  title: String,
  description: String,
  image: String,
  author: String,
  content: String,
  published: Date String,
  source: String, // original publisher
  links: Array, // list of alternative links
  ttr: Number, // time to read in second, 0 = unknown
}
```

##### `parserOptions` *optional*

Object with all or several of the following properties:

  - `wordsPerMinute`: Number, to estimate time to read. Default `300`.
  - `descriptionTruncateLen`: Number, max num of chars generated for description. Default `210`.
  - `descriptionLengthThreshold`: Number, min num of chars required for description. Default `180`.
  - `contentLengthThreshold`: Number, min num of chars required for content. Default `200`.

For example:

```js
import { extract } from '@extractus/article-extractor'

const article = await extract('https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html', {
  descriptionLengthThreshold: 120,
  contentLengthThreshold: 500
})

console.log(article)
```

##### `fetchOptions` *optional*

You can use this param to set request headers to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

For example:

```js
import { extract } from '@extractus/article-extractor'

const url = 'https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html'
const article = await extract(url, null, {
  headers: {
    'user-agent': 'Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1'
  }
})

console.log(article)
```

You can also specify a proxy endpoint to load remote content, instead of fetching directly.

For example:

```js
import { extract } from '@extractus/article-extractor'

const url = 'https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html'

await extract(url, null, {
  headers: {
    'user-agent': 'Opera/9.60 (Windows NT 6.0; U; en) Presto/2.1.1'
  },
  proxy: {
    target: 'https://your-secret-proxy.io/loadXml?url=',
    headers: {
      'Proxy-Authorization': 'Bearer YWxhZGRpbjpvcGVuc2VzYW1l...'
    }
  }
})
```

Passing requests to proxy is useful while running `@extractus/article-extractor` on browser. View [examples/browser-article-parser](examples/browser-article-parser) as reference example.

For more info about proxy authentication, please refer [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)

For a deeper customization, you can consider using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to replace `fetch` behaviors with your own handlers.

---

### Transformations

Sometimes the default extraction algorithm may not work well. That is the time when we need transformations.

By adding some functions before and after the main extraction step, we aim to come up with a better result as much as possible.

There are 2 methods to play with transformations:

- `addTransformations(Object transformation | Array transformations)`
- `removeTransformations(Array patterns)`

At first, let's talk about `transformation` object.

#### `transformation` object

In `@extractus/article-extractor`, `transformation` is an object with the following properties:

- `patterns`: required, a list of regexps to match the URLs
- `pre`: optional, a function to process raw HTML
- `post`: optional, a function to process extracted article

Basically, the meaning of `transformation` can be interpreted like this:

> with the urls which match these `patterns` <br>
> let's run `pre` function to normalize HTML content <br>
> then extract main article content with normalized HTML, and if success <br>
> let's run `post` function to normalize extracted article content

![article-extractor extraction process](https://res.cloudinary.com/pwshub/image/upload/v1657336822/documentation/article-parser_extraction_process.png)

Here is an example transformation:

```ts
{
  patterns: [
    /([\w]+.)?domain.tld\/*/,
    /domain.tld\/articles\/*/
  ],
  pre: (document) => {
    // remove all .advertise-area and its siblings from raw HTML content
    document.querySelectorAll('.advertise-area').forEach((element) => {
      if (element.nodeName === 'DIV') {
        while (element.nextSibling) {
          element.parentNode.removeChild(element.nextSibling)
        }
        element.parentNode.removeChild(element)
      }
    })
    return document
  },
  post: (document) => {
    // with extracted article, replace all h4 tags with h2
    document.querySelectorAll('h4').forEach((element) => {
      const h2Element = document.createElement('h2')
      h2Element.innerHTML = element.innerHTML
      element.parentNode.replaceChild(h2Element, element)
    })
    // change small sized images to original version
    document.querySelectorAll('img').forEach((element) => {
      const src = element.getAttribute('src')
      if (src.includes('domain.tld/pics/150x120/')) {
        const fullSrc = src.replace('/pics/150x120/', '/pics/original/')
        element.setAttribute('src', fullSrc)
      }
    })
    return document
  }
}
```

- To write better transformation logic, please refer [linkedom](https://github.com/WebReflection/linkedom) and [Document Object](https://developer.mozilla.org/en-US/docs/Web/API/Document).

#### `addTransformations(Object transformation | Array transformations)`

Add a single transformation or a list of transformations. For example:

```ts
import { addTransformations } from '@extractus/article-extractor'

addTransformations({
  patterns: [
    /([\w]+.)?abc.tld\/*/
  ],
  pre: (document) => {
    // do something with document
    return document
  },
  post: (document) => {
    // do something with document
    return document
  }
})

addTransformations([
  {
    patterns: [
      /([\w]+.)?def.tld\/*/
    ],
    pre: (document) => {
      // do something with document
      return document
    },
    post: (document) => {
      // do something with document
      return document
    }
  },
  {
    patterns: [
      /([\w]+.)?xyz.tld\/*/
    ],
    pre: (document) => {
      // do something with document
      return document
    },
    post: (document) => {
      // do something with document
      return document
    }
  }
])
````

The transformations without `patterns` will be ignored.

#### `removeTransformations(Array patterns)`

To remove transformations that match the specific patterns.

For example, we can remove all added transformations above:

```js
import { removeTransformations } from '@extractus/article-extractor'

removeTransformations([
  /([\w]+.)?abc.tld\/*/,
  /([\w]+.)?def.tld\/*/,
  /([\w]+.)?xyz.tld\/*/
])
```

Calling `removeTransformations()` without parameter will remove all current transformations.

#### Priority order

While processing an article, more than one transformation can be applied.

Suppose that we have the following transformations:

```ts
[
  {
    patterns: [
      /http(s?):\/\/google.com\/*/,
      /http(s?):\/\/goo.gl\/*/
    ],
    pre: function_one,
    post: function_two
  },
  {
    patterns: [
      /http(s?):\/\/goo.gl\/*/,
      /http(s?):\/\/google.inc\/*/
    ],
    pre: function_three,
    post: function_four
  }
]
```

As you can see, an article from `goo.gl` certainly matches both them.

In this scenario, `@extractus/article-extractor` will execute both transformations, one by one:

`function_one` -> `function_three` -> extraction -> `function_two` -> `function_four`

---

### `sanitize-html`'s options

`@extractus/article-extractor` uses [sanitize-html](https://www.npmjs.com/package/sanitize-html) to make a clean sweep of HTML content.

Here is the [default options](src/config.js#L5)

Depending on the needs of your content system, you might want to gather some HTML tags/attributes, while ignoring others.

There are 2 methods to access and modify these options in `@extractus/article-extractor`.

- `getSanitizeHtmlOptions()`
- `setSanitizeHtmlOptions(Object sanitizeHtmlOptions)`

Read [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options) docs for more info.

---

## Test

```bash
git clone https://github.com/extractus/article-extractor.git
cd article-extractor
npm i
npm test
```

![article-extractor-test.png](https://i.imgur.com/TbRCUSS.png?110222)


## Quick evaluation

```bash
git clone https://github.com/extractus/article-extractor.git
cd article-extractor
npm i
npm run eval {URL_TO_PARSE_ARTICLE}
```

## License
The MIT License (MIT)

---
