# article-parser

Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
![CI test](https://github.com/ndaidong/article-parser/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg)](https://coveralls.io/github/ndaidong/article-parser)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_article-parser&metric=alert_status)](https://sonarcloud.io/dashboard?id=ndaidong_article-parser)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Demo

- [Give it a try!](https://demos.pwshub.com/article-parser)
- [Example FaaS](https://extractor.pwshub.com/article/parse?url=https://www.binance.com/en/blog/markets/15-new-years-resolutions-that-will-make-2022-your-best-year-yet-421499824684903249&apikey=demo-orePhhidnWKWPvF8EYKap7z55cN)


## Setup

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
// const { read } = require('article-parser/dist/cjs/article-parser.js')

const url = 'https://www.binance.com/en/blog/markets/15-new-years-resolutions-that-will-make-2022-your-best-year-yet-421499824684903249'

extract(url).then((article) => {
  console.log(article)
}).catch((err) => {
  console.trace(err)
})
```

##### Note:

> Since Node.js v14, ECMAScript modules [have became the official standard format](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_modules_ecmascript_modules).
> Just ensure that you are [using module system](https://nodejs.org/api/packages.html#determining-module-system) and enjoy with ES6 import/export syntax.


## APIs

- [.extract(String url | String html)](#extractstring-url--string-html)
- [.addQueryRules(Array queryRules)](#addqueryrulesarray-queryrules)
- [Configuration methods](#configuration-methods)


#### extract(String url | String html)

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

[Click here](https://extractor.pwshub.com/article/parse?url=https://www.binance.com/en/blog/markets/15-new-years-resolutions-that-will-make-2022-your-best-year-yet-421499824684903249&apikey=demo-orePhhidnWKWPvF8EYKap7z55cN) for seeing an actual result.


#### addQueryRules(Array queryRules)

Add custom rules to get main article from the specific domains.

This can be useful when the default extraction algorithm fails, or when you want to remove some parts of main article content.

Example:

```js
import { addQueryRules, extract } from 'article-parser'

// extractor doesn't work for you!
extract('https://bad-website.domain/page/article')

// add some rules for bad-website.domain
addQueryRules([
  {
    patterns: [
      /http(s?):\/\/bad-website.domain\/*/
    ],
    selector: '#noop_article_locates_here',
    unwanted: [
      '.advertise-area',
      '.stupid-banner'
    ]
  }
])

// extractor will try to find article at `#noop_article_locates_here`

// call it again, hopefully it works for you now :)
extract('https://bad-website.domain/page/article')
````

While adding rules, you can specify a `transform()` function to fine-tune article content more thoroughly.

Example rule with transformation:

```js
import { addQueryRules } from 'article-parser'

addQueryRules([
  {
    patterns: [
      /http(s?):\/\/bad-website.domain\/*/
    ],
    selector: '#article_id_here',
    transform: ($) => {
      // with $ is cheerio's DOM instance which contains article content
      // so you can do everything cheerio supports
      // for example, here we replace all <h1></h1> with <b></b>
      $('h1').replaceWith(function () {
        const h1Html = $(this).html()
        return `<b>${h1Html}</b>`
      })
      // at the end, you mush return $
      return $
    }
  }
])
```

Please refer [cheerio's docs](https://cheerio.js.org/) for more info.


#### Configuration methods

In addition, this lib provides some methods to customize default settings. Don't touch them unless you have reason to do that.

- getParserOptions()
- setParserOptions(Object parserOptions)
- getRequestOptions()
- setRequestOptions(Object requestOptions)
- getSanitizeHtmlOptions()
- setSanitizeHtmlOptions(Object sanitizeHtmlOptions)

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
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
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
