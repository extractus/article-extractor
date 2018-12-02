// configs

const {
  isString,
  isNumber,
  isObject,
  isArray,
  unique,
  clone,
} = require('bellajs');

let fetchOptions = {
  headers: {},
  timeout: 0,
  agent: false,
};

let wordsPerMinute = 300;

let htmlRules = {
  allowedTags: [
    'html', 'body', 'meta', 'link', 'title',
    'head', 'nav',
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
};


let SoundCloudKey = 'd5ed9cc54022577fb5bba50f057d261c';
let YouTubeKey = 'AIzaSyB5phK8ORN9328zFsnYt9Awkortka7-mvc';
let EmbedlyKey = '50a2e9136d504850a9d080b759fd3019';


const configure = (o) => {
  if (o.fetchOptions) {
    let {
      headers = false,
      timeout = false,
      agent = false,
    } = o.fetchOptions;

    if (isNumber(timeout) && timeout >= 0) {
      fetchOptions.timeout = timeout;
    }
    if (isObject(headers)) {
      fetchOptions.headers = headers;
    }
    if (isString(agent)) {
      fetchOptions.agent = agent;
    }
  }

  if (o.wordsPerMinute) {
    let wpm = Number(o.wordsPerMinute);
    if (isNumber(wpm) && wpm > 100 && wpm < 1000) {
      wordsPerMinute = wpm;
    }
  }

  if (o.htmlRules) {
    let hr = o.htmlRules;
    if (isObject(hr)) {
      if (hr.allowedTags && isArray(hr.allowedTags)) {
        htmlRules.allowedTags = unique(hr.allowedTags);
      }
      if (hr.allowedAttributes && isObject(hr.allowedAttributes)) {
        htmlRules.allowedAttributes = hr.allowedAttributes;
      }
    }
  }

  if (o.SoundCloudKey) {
    SoundCloudKey = o.SoundCloudKey;
  }
  if (o.YouTubeKey) {
    YouTubeKey = o.YouTubeKey;
  }
  if (o.EmbedlyKey) {
    EmbedlyKey = o.EmbedlyKey;
  }

  return true;
};

let config = {
  set configure(props = {}) {
    return props;
  },
  get configure() {
    return configure;
  },
  get fetchOptions() {
    return clone(fetchOptions);
  },
  get htmlRules() {
    return clone(htmlRules);
  },
  get wordsPerMinute() {
    return wordsPerMinute;
  },
  get SoundCloudKey() {
    return SoundCloudKey;
  },
  get YouTubeKey() {
    return YouTubeKey;
  },
  get EmbedlyKey() {
    return EmbedlyKey;
  },
};

module.exports = config;
