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

### Sample result

```
{ 
  alias: 'string-title-normalized-1449067915486',
  url: 'https://www.youtube.com/watch?v=videoid',
  canonicals: [ 'https://www.youtube.com/watch?v=videoid' ],
  title: 'Video title here',
  description: 'Maybe some description',
  image: 'https://i.ytimg.com/vi/videoid/hqdefault.jpg',
  content: 'Main article or embedded object',
  author: 'First Last',
  source: 'Site name',
  domain: 'domain',
  duration: 'duration in second'
}

```

## Test

```
npm install
mocha
```

 _* Ensure that you have [mocha](https://mochajs.org/) installed_
