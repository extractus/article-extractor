# article-parser
Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
![CI test](https://github.com/ndaidong/article-parser/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg)](https://coveralls.io/github/ndaidong/article-parser)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_article-parser&metric=alert_status)](https://sonarcloud.io/dashboard?id=ndaidong_article-parser)


## Demo

- [Give it a try!](https://ndaidong.github.io/article-parser-demo)
- [Example FaaS](https://us-central1-technews-251304.cloudfunctions.net/article-parser?url=https://devblogs.nvidia.com/training-custom-pretrained-models-using-tlt/)

View [screenshots](#screenshots) for more info.


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
Return: a Promise

Here is how we can use `article-parser`:

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

```

In comparison to v3, the `article` object structure has been changed too. Now it looks like below:

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
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'label',
    'fieldset', 'legend',
    'img', 'picture',
    'br', 'p', 'hr',
    'a',
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt'],
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
npm install  // or `yarn install` or `pnpm install`
npm test
```

# License

The MIT License (MIT)
