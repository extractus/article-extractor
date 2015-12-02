# article-parser
Extract main article, main image, meta and oEmbed from URL.

[![NPM](https://badge.fury.io/js/article-parser.svg)](https://badge.fury.io/js/article-parser) ![Travis](https://travis-ci.org/ndaidong/article-parser.svg?branch=master)

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

##### configure(Object conf)

```
{
  wordsPerMinute: Number, // default 300, use to estimate time to read
  blackList: Array, // a set of domain we don't want to parse
  adsDomain: Array, // a set of domain that often contains utm_, pk_ in URLs we want to clean
  htmlRules: Object, // passed to sanitize-html to clean HTML, see [sanitize-html](https://www.npmjs.com/package/sanitize-html)
  SoundCloudKey: String, // use to get audio duration. Get it here https://developers.soundcloud.com/
  YouTubeKey: String, // use to get video duration. Get it here https://console.developers.google.com/
}
```

##### extract(String url)

Return error message or an object:

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


## Test

```
npm install
mocha
```

 _* Ensure that you have [mocha](https://mochajs.org/) installed_
