var config = {};

config.wordsPerMinute = 300;

config.blackList = [
  /twitter\.com\/(\S+)\/status\/(\w+)$/,
  /athlonsports\.com/
];

config.adsDomain = [
  'lifehacker.com',
  'deadspin.com',
  'gizmodo.com',
  'stocktwits.com',
  /dailyjs.com/
];

config.exceptDomain = [
  'nytimes.com',
  'sfgate.com',
  'theverge.com'
];

config.htmlRules = {
  allowedTags: [
    'html', 'body', 'meta', 'link', 'title',
    'head', 'nav',
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong',
    'div', 'span', 'p', 'article', 'blockquote',
    'ul', 'ol', 'li',
    'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'img', 'picture',
    'br',
    'a'
  ],
  allowedAttributes: {
    'a': [ 'href' ],
    'img': [ 'src', 'alt' ],
    'meta': [ 'content', 'name', 'property', 'charset', 'viewport' ],
    'link': [ 'href', 'type' ]
  }
};

config.SoundCloudKey = 'd5ed9cc54022577fb5bba50f057d261c';
config.YouTubeKey = 'AIzaSyB5phK8ORN9328zFsnYt9Awkortka7-mvc';
config.EmbedlyKey = '50a2e9136d504850a9d080b759fd3019';
config.ReadabilityToken = 'f242da3a7b6d1f9a6e2070677a221e5bc3f758dd';

module.exports = config;
