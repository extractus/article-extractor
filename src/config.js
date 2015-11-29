var config = {};

config.wordsPerMinute = 300;

config.blackList = [
  '//twitter.com/',
  '//facebook.com/',
  '//linksie.com/',
  'nytimes.com/'
];

config.adsDomain = [
  'lifehacker.com',
  'deadspin.com',
  'gizmodo.com',
  'stocktwits.com',
  'dailyjs.com'
];

config.htmlRules = {
  allowedTags: [
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
    'a': ['href'],
    'img': ['src', 'alt']
  }
}

module.exports = config;
