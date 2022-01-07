// configs

const { clone, copies } = require('bellajs')

const defaultRules = require('./rules')

const rules = clone(defaultRules)

const requestOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:94.0) Gecko/20100101 Firefox/94.0',
    accept: 'text/html; charset=utf-8'
  },
  responseType: 'text',
  responseEncoding: 'utf8',
  timeout: 6e4, // 1 minute
  maxRedirects: 3
}

const sanitizeHtmlOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong', 'small', 'sup', 'sub',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'details', 'summary',
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'fieldset', 'legend',
    'figure', 'figcaption', 'img', 'picture',
    'video', 'audio', 'source',
    'iframe',
    'progress',
    'br', 'p', 'hr',
    'label',
    'abbr',
    'a',
    'svg'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'title'],
    abbr: ['title'],
    progress: ['value', 'max'],
    img: ['src', 'srcset', 'alt', 'width', 'height', 'style', 'title'],
    picture: ['media', 'srcset'],
    video: ['controls', 'width', 'height', 'autoplay', 'muted'],
    audio: ['controls'],
    source: ['src', 'srcset', 'data-srcset', 'type', 'media', 'sizes'],
    iframe: ['src', 'frameborder', 'height', 'width', 'scrolling'],
    svg: ['width', 'height'] // sanitize-html does not support svg fully yet
  },
  allowedIframeDomains: ['youtube.com', 'vimeo.com']
}

const parserOptions = {
  wordsPerMinute: 300, // to estimate "time to read"
  urlsCompareAlgorithm: 'levenshtein', // to find the best url from list
  descriptionLengthThreshold: 40, // min num of chars required for description
  descriptionTruncateLen: 156, // max num of chars generated for description
  contentLengthThreshold: 200 // content must have at least 200 chars
}

module.exports = {
  getParserOptions: () => {
    return clone(parserOptions)
  },
  getRequestOptions: () => {
    return clone(requestOptions)
  },
  getSanitizeHtmlOptions: () => {
    return clone(sanitizeHtmlOptions)
  },
  setParserOptions: (opts) => {
    copies(opts, parserOptions)
  },
  setRequestOptions: (opts) => {
    copies(opts, requestOptions)
  },
  setSanitizeHtmlOptions: (opts) => {
    copies(opts, sanitizeHtmlOptions)
    if (Array.isArray(opts.allowedTags)) {
      sanitizeHtmlOptions.allowedTags = [...opts.allowedTags]
    }
  },
  getQueryRules: () => {
    return [...rules]
  },
  addQueryRules: (entries = []) => {
    entries.forEach((item) => {
      rules.push(item)
    })
    return rules.length
  }
}
