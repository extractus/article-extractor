# article-parser
Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
[![Build Status](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)](https://travis-ci.org/ndaidong/article-parser)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg?branch=master)](https://coveralls.io/github/ndaidong/article-parser?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/article-parser.svg)](https://gemnasium.com/github.com/ndaidong/article-parser)
[![Known Vulnerabilities](https://snyk.io/test/npm/article-parser/badge.svg)](https://snyk.io/test/npm/article-parser)

### Installation

```
npm install article-parser
```

### Usage

```
import ArticleParser from 'article-parser';

let url = 'http://yhoo.it/1MJUFov';

ArticleParser.extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

### APIs

 - configure(Object conf)
 - extract(String url)
 - parseWithEmbedly(String url [, String EmbedlyKey])
 - parseMeta(String html, String url)
 - getArticle(String html)
 - absolutify(String baseURL, String url)
 - purify(String url)


#### configure(Object conf)

```
{
  wordsPerMinute: Number, // default 300, use to estimate time to read
  blackList: Array, // a set of domain we don't want to parse
  exceptDomain: Array, // a set of domain that will be parsed using Embedly
  adsDomain: Array, // a set of domain that often contains utm_, pk_ in URLs we want to clean
  htmlRules: Object, // passed to sanitize-html to clean HTML, refer: https://www.npmjs.com/package/sanitize-html
  SoundCloudKey: String, // use to get audio duration. Get it here https://developers.soundcloud.com/
  YouTubeKey: String, // use to get video duration. Get it here https://console.developers.google.com/,
  EmbedlyKey: String, // use to extract with Embedly API. Refer http://docs.embed.ly/docs/extract
}
```

Default configurations may work for most case.


#### extract(String url)

Extract article data from specified url.

```
var ArticleParser = require('article-parser');

var url = 'http://yhoo.it/1MJUFov';

ArticleParser.extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

Now *article* would be something like this:

```
{
  alias: 'how-to-stay-calm-when-you-know-you-ll-be-stressed-daniel-levitin-ted-talks-1449068980884',
  url: 'https://www.youtube.com/watch?v=8jPQjjsBbIc',
  canonicals: [ 'https://www.youtube.com/watch?v=8jPQjjsBbIc' ],
  title: 'How to Stay Calm When You Know You\'ll Be Stressed | Daniel Levitin | TED Talks',
  description: 'You\'re not at your best when you\'re stressed. In fact, your brain has evolved over millennia to release cortisol in stressful situations, inhibiting...',
  image: 'https://i.ytimg.com/vi/8jPQjjsBbIc/hqdefault.jpg',
  content: '<iframe width="480" height="270" src="https://www.youtube.com/embed/8jPQjjsBbIc?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  author: 'TED',
  source: 'YouTube',
  domain: 'www.youtube.com',
  duration: 741,
  publishedTime: '2013-11-12T19:57:40+00:00'
}

```

#### parseWithEmbedly(String url [, String EmbedlyKey])

Extract article data from specified url using [Embedly Extract API](http://embed.ly/extract):

The second parameter is optional. If you've added your Embedly key via configure() method, you can ignore it here.

```
var ArticleParser = require('article-parser');

var url = 'http://yhoo.it/1MJUFov';

ArticleParser.parseWithEmbedly(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```


#### parseMeta(String html, String url)

Get meta data from webpage's html.

```
var ArticleParser = require('article-parser');
var fetch = require('node-fetch');

var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';

fetch(url).then((res) => {
  return res.text();
}).then((html) => {
  let metaData = ArticleParser.parseMeta(html, url);
  return metaData;
});
```

Now *metaData* would be something like this:

```
{
  url: 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6',
  canonical: 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6',
  title: 'Setup Rocket Chat within 10 minutes',
  description: 'Do you want to get your own Slack app for your company or your team. Rocket Chat may be what you need.',
  image: 'https://cdn-images-1.medium.com/max/800/1*9IX5MWrnaCBzzeS3h5N2oA.png',
  author: '@ndaidong',
  source: 'Medium',
  publishedTime: '2013-11-12T19:57:40+00:00'
}
```


#### getArticle(String html)

Get main article content from webpage's html:

```
var ArticleParser = require('article-parser');
var fetch = require('node-fetch');

var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';

fetch(url).then((res) => {
  return res.text();
}).then((html) => {
  let content = ArticleParser.getArticle(html);
  return content;
})
.then((article) => {
  console.log(article);
})
.catch((err) => {
  console.log(err);
});
```

Now *content* would be clean text of main article extracted from *url*.

#### absolutify(String baseURL, String url)

Return an absolute url.

```
var imgSrc = absolutify('https://www.awesome.com/articles/hello-world.html', '../images/avatar.png');
console.log(imgSrc); // https://www.awesome.com/images/avatar.png
```


#### purify(String url)

Return a purified url.

```
var fullUrl = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6#.98xbvjtjw?utm_medium=email&utm_source=Newsletter&utm_campaign=Autumn+Newsletter&utm_content=logo+link'
var goodURL = purify(fullUrl);
console.log(goodURL); // https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6
```

## Test

```
git clone https://github.com/ndaidong/article-parser.git
cd article-parser
npm install
npm test
```

# License

The MIT License (MIT)
