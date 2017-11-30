
const {
  clone,
  isString,
  isNumber,
  isObject,
  isArray,
} = require('bellajs');

const config = {};

config.fetchOptions = {
  headers: {},
  timeout: 0,
  agent: false,
};

config.wordsPerMinute = 300;

config.article = {
  htmlRules: {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5',
      'u', 'b', 'i', 'em', 'strong',
      'div', 'span', 'p', 'article', 'blockquote',
      'ul', 'ol', 'li',
      'dd', 'dl',
      'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
      'label',
      'fieldset', 'legend',
      'img', 'picture',
      'br',
      'a',
    ],
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'alt'],
      link: ['href', 'type'],
    },
  },
};

config.htmlRules = clone(config.article.htmlRules);
config.htmlRules.allowedTags = [].concat(
  config.htmlRules.allowedTags,
  [
    'html', 'body', 'meta', 'link', 'title',
    'head', 'nav',
  ]
);

config.SoundCloudKey = 'd5ed9cc54022577fb5bba50f057d261c';
config.YouTubeKey = 'AIzaSyB5phK8ORN9328zFsnYt9Awkortka7-mvc';
config.EmbedlyKey = '50a2e9136d504850a9d080b759fd3019';

const getConfig = () => {
  return {
    fetchOptions: clone(config.fetchOptions),
    article: clone(config.article),
    htmlRules: clone(config.htmlRules),
    wordsPerMinute: config.wordsPerMinute,
    SoundCloudKey: config.SoundCloudKey,
    YouTubeKey: config.YouTubeKey,
    EmbedlyKey: config.EmbedlyKey,
  };
};

const configure = (o) => {
  if (o.fetchOptions) {
    let {
      headers = false,
      timeout = false,
      agent = false,
    } = o.fetchOptions;

    if (isNumber(timeout) && timeout >= 0) {
      config.fetchOptions.timeout = timeout;
    }
    if (isObject(headers)) {
      config.fetchOptions.headers = headers;
    }
    if (isString(agent)) {
      config.fetchOptions.agent = agent;
    }
  }

  if (o.wordsPerMinute) {
    let wpm = Number(o.wordsPerMinute);
    if (isNumber(wpm) && wpm > 100 && wpm < 1000) {
      config.wordsPerMinute = wpm;
    }
  }

  if (o.htmlRules) {
    let hr = o.htmlRules;
    if (isObject(hr)) {
      if (hr.allowedTags && isArray(hr.allowedTags)) {
        config.htmlRules.allowedTags = hr.allowedTags;
      }
      if (hr.allowedAttributes && isObject(hr.allowedAttributes)) {
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

  return getConfig();
};

Object.defineProperty(config, 'getConfig', {
  configurable: false,
  writable: false,
  enumerable: false,
  value: getConfig,
});

Object.defineProperty(config, 'configure', {
  configurable: false,
  writable: false,
  enumerable: false,
  value: configure,
});

module.exports = config;
