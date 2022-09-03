# article-parser

Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
![CI test](https://github.com/ndaidong/article-parser/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg)](https://coveralls.io/github/ndaidong/article-parser)
![CodeQL](https://github.com/ndaidong/article-parser/workflows/CodeQL/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy?repo=https://github.com/ndaidong/article-parser-deta)

## Demo

- [Give it a try!](https://demos.pwshub.com/article-parser)
- [Example FaaS](https://extract-article.deta.dev/?url=https://www.freecodecamp.org/news/what-is-an-ide-for-beginners)

## Install

- Node.js

  ```bash
  npm i article-parser

  # pnpm
  pnpm i article-parser

  # yarn
  yarn add article-parser
  ```

### Usage

```js
import { extract } from 'article-parser'

// with CommonJS environments
// const { extract } = require('article-parser/dist/cjs/article-parser.js')

const url = 'https://www.binance.com/en/blog/markets/15-new-years-resolutions-that-will-make-2022-your-best-year-yet-421499824684903249'

extract(url).then((article) => {
  console.log(article)
}).catch((err) => {
  console.trace(err)
})
```

## APIs

- [.extract(String url | String html)](#extractstring-url--string-html)
- [Transformations](#transformations)
  - [`transformation` object](#transformation-object)
  - [.addTransformations](#addtransformationsobject-transformation--array-transformations)
  - [.removeTransformations](#removetransformationsarray-patterns)
  - [Priority order](#priority-order)
- [Configuration methods](#configuration-methods)

---

### extract(String url | String html)

Load and extract article data. Return a Promise object.

Example:

```js
import { extract } from 'article-parser'

const getArticle = async (url) => {
  try {
    const article = await extract(url)
    return article
  } catch (err) {
    console.trace(err)
    return null
  }
}

getArticle('https://domain.com/path/to/article')
```

If the extraction works well, you should get an `article` object with the structure as below:

```json
{
  "url": URI String,
  "title": String,
  "description": String,
  "image": URI String,
  "author": String,
  "content": HTML String,
  "published": Date String,
  "source": String, // original publisher
  "links": Array, // list of alternative links
  "ttr": Number, // time to read in second, 0 = unknown
}
```

[Click here](https://extractor.pwshub.com/article/parse?url=https://www.binance.com/en/blog/markets/15-new-years-resolutions-that-will-make-2022-your-best-year-yet-421499824684903249&apikey=demo-TEyRycuuMCiGBiBocbLGSpagfj7gOF8AMyAWfEgP) for seeing an actual result.

---

### Transformations

Sometimes the default extraction algorithm may not work well. That is the time when we need transformations.

By adding some functions before and after the main extraction step, we aim to come up with a better result as much as possible.

`transformation` is available since `article-parser@7.0.0`, as the improvement of `queryRule` in the older versions.

To play with transformations, `article-parser` provides 2 public methods as below:

- `addTransformations(Object transformation | Array transformations)`
- `removeTransformations(Array patterns)`

At first, let's talk about `transformation` object.

#### `transformation` object

In `article-parser`, `transformation` is an object with the following properties:

- `patterns`: required, list of [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) objects
- `pre`: optional, a function to process raw HTML
- `post`: optional, a function to proces extracted article

Basically, the meaning of `transformation` can be interpreted like this:

> with the urls which match these `patterns` <br>
> let's run `pre` function to normalize HTML content <br>
> then extract main article content with normalized HTML, and if success <br>
> let's run `post` function to normalize extracted article content

![article-parser extraction process](https://res.cloudinary.com/pwshub/image/upload/v1657336822/documentation/article-parser_extraction_process.png)

Here is an example transformation:

```js
{
  patterns: [
    '*://*.domain.tld/*',
    '*://domain.tld/articles/*'
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

- Regarding the syntax for patterns, please view [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API).
- To write better transformation logic, please refer [Document Object](https://developer.mozilla.org/en-US/docs/Web/API/Document).

#### `addTransformations(Object transformation | Array transformations)`

Add a single transformation or a list of transformations. For example:

```js
import { addTransformations } from 'article-parser'

addTransformations({
  patterns: [
    '*://*.abc.tld/*'
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
      '*://*.def.tld/*'
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
      '*://*.xyz.tld/*'
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
import { removeTransformations } from 'article-parser'

removeTransformations([
  '*://*.abc.tld/*',
  '*://*.def.tld/*',
  '*://*.xyz.tld/*'
])
```

Calling `removeTransformations()` without parameter will remove all current transformations.

#### Priority order

While processing an article, more than one transformation can be applied.

Suppose that we have the following transformations:

```js
[
  {
    patterns: [
      '*://google.com/*',
      '*://goo.gl/*'
    ],
    pre: function_one,
    post: function_two
  },
  {
    patterns: [
      '*://goo.gl/*',
      '*://google.inc/*'
    ],
    pre: function_three,
    post: function_four
  }
]
```

As you can see, an article from `goo.gl` certainly matches both them.

In this scenario, `article-parser` will execute both transformations, one by one:

`function_one` -> `function_three` -> extraction -> `function_two` -> `function_four`

---

### Configuration methods

In addition, this lib provides some methods to customize default settings. Don't touch them unless you have reason to do that.

- getParserOptions()
- setParserOptions(Object parserOptions)
- getRequestOptions()
- setRequestOptions(Object requestOptions)
- getSanitizeHtmlOptions()
- setSanitizeHtmlOptions(Object sanitizeHtmlOptions)
- getHtmlCrushOptions(Object htmlCrushOptions)
- setHtmlCrushOptions()

Here are default properties/values:


#### Object `parserOptions`:

```js
{
  wordsPerMinute: 300, // to estimate "time to read"
  urlsCompareAlgorithm: 'levenshtein', // to find the best url from list
  descriptionLengthThreshold: 40, // min num of chars required for description
  descriptionTruncateLen: 156, // max num of chars generated for description
  contentLengthThreshold: 200 // content must have at least 200 chars
}
```

Read [string-comparison](https://www.npmjs.com/package/string-comparison) docs for more info about `urlsCompareAlgorithm`.


#### Object `requestOptions`:

```js
{
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
    accept: 'text/html; charset=utf-8'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4,
  maxRedirects: 3
}
```
Read [axios' request config](https://axios-http.com/docs/req_config) for more info.

#### Object `sanitizeHtmlOptions`:

```js
{
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong', 'small', 'sup', 'sub',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'details', 'summary',
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'fieldset', 'legend',
    'figure', 'figcaption', 'img', 'picture',
    'video', 'audio', 'source',
    'iframe',
    'progress',
    'br', 'p', 'hr',
    'label',
    'abbr',
    'a',
    'svg'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'title'],
    abbr: ['title'],
    progress: ['value', 'max'],
    img: ['src', 'srcset', 'alt', 'width', 'height', 'style', 'title'],
    picture: ['media', 'srcset'],
    video: ['controls', 'width', 'height', 'autoplay', 'muted'],
    audio: ['controls'],
    source: ['src', 'srcset', 'data-srcset', 'type', 'media', 'sizes'],
    iframe: ['src', 'frameborder', 'height', 'width', 'scrolling'],
    svg: ['width', 'height']
  },
  allowedIframeDomains: ['youtube.com', 'vimeo.com']
}
```

Read [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options) docs for more info.

#### Object `htmlCrushOptions`:

```js
{
  removeLineBreaks: true,
  removeHTMLComments: 2
}
```

For more options, please refer [html-crush](https://www.codsen.com/os/html-crush/) docs.


## Test

```bash
git clone https://github.com/ndaidong/article-parser.git
cd article-parser
npm install
npm test

# quick evaluation
npm run eval {URL_TO_PARSE_ARTICLE}
```

## License
The MIT License (MIT)

---
