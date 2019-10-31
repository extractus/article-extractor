# article-parser
Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
[![Build Status](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)](https://travis-ci.org/ndaidong/article-parser)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg?branch=master&updated=1)](https://coveralls.io/github/ndaidong/article-parser?branch=master)


## Usage

```
npm install article-parser
```

Then:

```js
const {
  extract
} = require('article-parser');

const url = 'https://goo.gl/MV8Tkh';

extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

## APIs

Since v4, `article-parser` will focus only on its main mission: extract main readable content from given webpages, such as blog posts or news entries. Although it is still able to get other kinds of content like YouTube movies, SoundCloud media, etc, they are just additions.

#### extract(String url | String html)

Extract data from specified url or full HTML page content.
Return: an article object

Example:

```js
import {
  extract
} from 'article-parser';

const getArticle = async (url) => {
  try {
    const article = await extract(url);
    return article;
  } catch (err) {
    console.trace(err);
  }
};

const url = 'https://ghost.org/blog/3-0/';
const article = getArticle(url);
```

Now *article* would be something like this:

```json
{
  "url": "https://ghost.org/blog/3-0/",
  "links": [
    "https://some.where/blog/ghost-3-0",
    "https://ghost.org/blog/3-0/"
  ],
  "title": "Announcing Ghost 3.0 – The story behind raising $5m",
  "description": "15,000 commits later - we just launched Ghost 3.0 and we've raised $5m in funding from the most forward thinking investors: our customers! Read our story.",
  "image": "https://mainframe.ghost.io/content/images/2019/10/3.0-blog-feature-img.png",
  "author": "@ghost",
  "content": "<div><p>Today we released the third major version of Ghost, representing a total of more than 15,000 commits across almost 300 releases. The product is as fast and stable as it has ever been, and now it also has support for memberships, subscription revenue, and API driven modern site architectures.</p><p>But you might be wondering about...",
  "source": "Ghost",
  "published": "2019-10-22T10:35:14.000+00:00"
}
```

#### Configuration methods

In addition, this lib provides some methods to customize default settings. Don't touch them unless you have reason to do that.

- setParserOptions(Object parserOptions)
- getParserOptions()
- setNodeFetchOptions(Object nodeFetchOptions)
- getNodeFetchOptions()
- setSanitizeHtmlOptions(Object sanitizeHtmlOptions)
- getSanitizeHtmlOptions()

Here are default properties/values:

#### Object `parserOptions`:

```js
{
  wordsPerMinute: 300,
  urlsCompareAlgorithm: 'levenshtein',
}
```

Read [string-comparison](https://www.npmjs.com/package/string-comparison) docs for more info about `urlsCompareAlgorithm`.


#### Object `nodeFetchOptions`:

```js
{
  headers: {
    'user-agent': 'article-parser/4.0.0',
  },
  timeout: 30000,
  redirect: 'follow',
  compress: true,
  agent: false,
}
```
Read [node-fetch](https://www.npmjs.com/package/node-fetch#options) docs for more info.

#### Object `sanitizeHtmlOptions`:

```js
{
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'label',
    'fieldset', 'legend',
    'img', 'picture',
    'br', 'p',
    'a',
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt'],
  },
}
```

Read [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options) docs for more info.


## Test

```bash
git clone https://github.com/ndaidong/article-parser.git
cd article-parser
npm install
npm test
```

# License

The MIT License (MIT)
