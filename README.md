# article-parser
Extract main article, main image, meta and oEmbed from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
![Travis](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/article-parser/badge.svg?branch=master)](https://coveralls.io/github/ndaidong/article-parser?branch=master)
![devDependency Status](https://david-dm.org/ndaidong/article-parser.svg)

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

### API


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
  ReadabilityToken: String, // use to extract with Readability Parser API. Refer https://www.readability.com/developers/api/parser
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
  duration: 741
}

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
  source: 'Medium'
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
});
```

Now *content* would be clean text of main article extracted from *url*.


#### getOEmbed(String url)

Get oEmbed data from given url. Use the same API from [oembed-auto-es6](https://www.npmjs.com/package/oembed-auto-es6).

```
var ArticleParser = require('article-parser');
var fetch = require('node-fetch');

let url = 'https://www.youtube.com/watch?v=8jPQjjsBbIc';

ArticleParser.getOEmbed(url).then((oEmbedData) => {
  console.log(oEmbedData);
}).catch((err) => {
  console.log(err);
});
```

Now *oEmbedData* is oEmbed content of that YouTube link.


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
npm install
npm test
```

![Screenshot](http://i.imgur.com/24M0QUq.png)



# License

The MIT License (MIT)
