
var bella = require('bellajs');

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
    a: ['href'],
    img: ['src', 'alt'],
    meta: ['content', 'name', 'property', 'charset', 'viewport'],
    link: ['href', 'type']
  }
};

config.SoundCloudKey = 'd5ed9cc54022577fb5bba50f057d261c';
config.YouTubeKey = 'AIzaSyB5phK8ORN9328zFsnYt9Awkortka7-mvc';
config.EmbedlyKey = '50a2e9136d504850a9d080b759fd3019';

var configure = (o) => {
  if (o.wordsPerMinute) {
    let wpm = Number(o.wordsPerMinute);
    if (bella.isNumber(wpm) && wpm > 100 && wpm < 1000) {
      config.wordsPerMinute = wpm;
    }
  }

  if (o.blackList) {
    let bl = o.blackList;
    if (bella.isArray(bl)) {
      config.blackList = bl;
    }
  }

  if (o.adsDomain) {
    let ad = o.adsDomain;
    if (bella.isArray(ad)) {
      config.adsDomain = ad;
    }
  }
  if (o.htmlRules) {
    let hr = o.htmlRules;
    if (bella.isObject(hr)) {
      if (hr.allowedTags && bella.isArray(hr.allowedTags)) {
        config.htmlRules.allowedTags = hr.allowedTags;
      }
      if (hr.allowedAttributes && bella.isObject(hr.allowedAttributes)) {
        config.htmlRules.allowedAttributes = hr.allowedAttributes;
      }
    }
  }

  if (o.SoundCloudKey) {
    config.SoundCloudKey = o.SoundCloudKey;
  }
  if (o.YouTubeKey) {
    config.YouTubeKey = o.YouTubeKey;
  }
  if (o.EmbedlyKey) {
    config.EmbedlyKey = o.EmbedlyKey;
  }
};

config.FETCH_OPTIONS = {
  timeout: 20 * 6e4
};

Object.defineProperty(config, 'configure', {
  configurable: false,
  writable: false,
  enumerable: false,
  value: configure
});

module.exports = config;
