# article-parser

Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
![CI test](https://github.com/ndaidong/article-parser/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg)](https://coveralls.io/github/ndaidong/article-parser)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_article-parser&metric=alert_status)](https://sonarcloud.io/dashboard?id=ndaidong_article-parser)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Demo

- [Give it a try!](https://ndaidong.github.io/article-parser-demo)
- [Example FaaS](https://us-central1-technews-251304.cloudfunctions.net/article-parser?url=https://devblogs.nvidia.com/training-custom-pretrained-models-using-tlt/)

View [screenshots](#screenshots) for more info.


## Installation

```bash
$ npm install article-parser

# pnpm
$ pnpm install article-parser

# yarn
$ yarn add article-parser
```

## Usage

```js
const { extract } = require('article-parser')

// es6 module syntax
import { extract } from 'article-parser'

// test
const url = 'https://dev.to/ndaidong/how-to-make-your-mongodb-container-more-secure-1646'

extract(url).then((article) => {
  console.log(article)
}).catch((err) => {
  console.trace(err)
})
```

Result:

```js
{
  url: 'https://dev.to/ndaidong/how-to-make-your-mongodb-container-more-secure-1646',
  title: 'How to make your MongoDB container more secure?',
  description: 'Start it with docker   The most simple way to get MongoDB instance in your machine is using...',
  links: [
    'https://dev.to/ndaidong/how-to-make-your-mongodb-container-more-secure-1646'
  ],
  image: 'https://res.cloudinary.com/practicaldev/image/fetch/s--qByI1v3K--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/p4sfysev3s1jhw2ar2bi.png',
  content: '...', // full article content here
  author: '@ndaidong',
  source: 'dev.to',
  published: '',
  ttr: 162
}

```

## APIs

#### extract(String url | String html [, querySelector])

Load and extract article data. Return a Promise object.

Example:

```js
const { extract } = require('article-parser')

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

Optional parameter `querySelector` can be specified for gathering main article content from relevant HTML element(s).

Example:

```js

const { extract } = require('article-parser')

const getArticleWithSelector = async (url, selector) => {
  try {
    const article = await extract(url, selector)
    return article
  } catch (err) {
    console.trace(err)
    return null
  }
}

getArticleWithSelector('https://domain.com/path/to/article', 'article.post-body')
```

#### Configuration methods

In addition, this lib provides some methods to customize default settings. Don't touch them unless you have reason to do that.

- setParserOptions(Object parserOptions)
- getParserOptions()
- setRequestOptions(Object requestOptions)
- getRequestOptions()
- setSanitizeHtmlOptions(Object sanitizeHtmlOptions)
- getSanitizeHtmlOptions()

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
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:94.0) Gecko/20100101 Firefox/94.0',
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
    'u', 'b', 'i', 'em', 'strong',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'label',
    'fieldset', 'legend',
    'img', 'picture',
    'br', 'p', 'hr',
    'a'
  ],
  allowedAttributes: {
    a: ['href', 'target'],
    img: ['src', 'alt']
  },
}
```

Read [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options) docs for more info.

## Screenshots

- Article Parser demo:

![Screenshot_2019-11-29_14-21-30.png](https://i.loli.net/2019/11/29/X3uP9aeTnq5Diwz.png)

- Example FasS with Google Cloud Function

![Screenshot_2019-11-29_14-38-32.png](https://i.loli.net/2019/11/29/upCFlkicESdy3Af.png)


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
