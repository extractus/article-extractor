# article-parser
Extract main article, main image and meta data from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser)
[![Build Status](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)](https://travis-ci.org/ndaidong/article-parser)
[![codecov](https://codecov.io/gh/ndaidong/article-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/ndaidong/article-parser)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/article-parser.svg)](https://gemnasium.com/github.com/ndaidong/article-parser)
[![NSP Status](https://nodesecurity.io/orgs/techpush/projects/d965e951-5bc6-41d3-90da-81e2a3b7e40f/badge)](https://nodesecurity.io/orgs/techpush/projects/d965e951-5bc6-41d3-90da-81e2a3b7e40f)

### Installation

```
npm install article-parser
```

### Usage

```
import ArticleParser from 'article-parser';

let url = 'https://goo.gl/MV8Tkh';

ArticleParser.extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
```

### APIs

 - configure(Object conf)
 - getConfig()
 - extract(String url)
 - extractOEmbed(String url)
 - parseWithEmbedly(String url [, String EmbedlyKey])


#### configure(Object conf)

```
{
  fetchOptions: Object, // simple version of [node-fetch options](https://www.npmjs.com/package/node-fetch#options). Only `headers`, `timeout` and `agent` are available.
  wordsPerMinute: Number, // default 300, use to estimate time to read
  htmlRules: Object, // options to to clean HTML with [sanitize-html](https://www.npmjs.com/package/sanitize-html#what-are-the-default-options)
  SoundCloudKey: String, // use to get audio duration. Get it here https://developers.soundcloud.com/
  YouTubeKey: String, // use to get video duration. Get it here https://console.developers.google.com/,
  EmbedlyKey: String, // use to extract with Embedly API. Refer http://docs.embed.ly/docs/extract
}
```

Default configurations may work for most case.

#### getConfig()

Returns current configurations.


#### extract(String url)

Extract article data from specified url.

```
var ArticleParser = require('article-parser');

let url = 'https://goo.gl/MV8Tkh';

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
  content: '<iframe src="https://www.youtube.com/embed/8jPQjjsBbIc?feature=oembed" frameborder="0" allowfullscreen></iframe>',
  author: 'TED',
  source: 'YouTube',
  domain: 'youtube.com',
  duration: 741,
  publishedTime: '2013-11-12T19:57:40+00:00'
}

```

#### parseWithEmbedly(String url [, String EmbedlyKey])

Extract article data from specified url using [Embedly Extract API](http://embed.ly/extract):

The second parameter is optional. If you've added your Embedly key via configure() method, you can ignore it here.

```
var ArticleParser = require('article-parser');

let url = 'https://goo.gl/MV8Tkh';

ArticleParser.parseWithEmbedly(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});
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
