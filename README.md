# article-parser
Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
[![Build Status](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)](https://travis-ci.org/ndaidong/article-parser)
[![Build Status](https://gitlab.com/ndaidong/article-parser/badges/master/build.svg)](https://gitlab.com/ndaidong/article-parser/pipelines)


### Usage

```
npm install article-parser
```

Then:

```js
const {
  extract
} = require('article-parser');

let url = 'https://goo.gl/MV8Tkh';

extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

### APIs

 - [configure(Object conf)](#configureobject-conf)
 - [extract(String url)](#extractstring-url)
 - [getConfig()](#getconfig)


#### configure(Object conf)

```js
{
  fetchOptions: Object,
  wordsPerMinute: Number,
  htmlRules: Object,
  SoundCloudKey: String,
  YouTubeKey: String
}
```

- fetchOptions: Object, simple version of [node-fetch options](https://www.npmjs.com/package/node-fetch#options). Only `headers`, `timeout` and `agent` are available here.
- wordsPerMinute: Number, default 300, use to estimate time to read
- htmlRules: Object, options to to clean HTML with [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options)
- SoundCloudKey: String, use to get audio duration. Get it [here](https://developers.soundcloud.com/).
- YouTubeKey: String, use to get video duration. Get it [here](https://console.developers.google.com/).


Default configurations may work for most case.


#### extract(String url)

Extract article data from specified url.

```js
const {
  extract
} = require('article-parser');

let url = 'https://www.youtube.com/watch?v=tRGJj59G1x4';

extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

Now *article* would be something like this:

```js
{
  title: 'Zato ESB - Test demo hosted on company server',
  alias: 'zato-esb-test-demo-hosted-on-company-server-1500021746537-PAQXw8IYcU',
  url: 'https://www.youtube.com/watch?v=tRGJj59G1x4',
  canonicals:
   [ 'https://www.youtube.com/watch?v=tRGJj59G1x4',
     'https://youtu.be/tRGJj59G1x4',
     'https://www.youtube.com/v/tRGJj59G1x4',
     'https://www.youtube.com/embed/tRGJj59G1x4' ],
  description: 'Our sample: https://github.com/greenglobal/zato-demo Zato homepage: https://zato.io Tutorial: "Zato — a powerful Python-based ESB solution for your SOA" http...',
  content: '<iframe src="https://www.youtube.com/embed/tRGJj59G1x4?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  image: 'https://i.ytimg.com/vi/tRGJj59G1x4/hqdefault.jpg',
  author: 'Dong Nguyen',
  source: 'YouTube',
  domain: 'youtube.com',
  publishedTime: '',
  duration: 292
}

```


#### getConfig()

Return the current configurations.


## Test

```bash
git clone https://github.com/ndaidong/article-parser.git
cd article-parser
npm install
npm test
```

# License

The MIT License (MIT)
