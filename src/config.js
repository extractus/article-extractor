// configs

const { clone, copies } = require('bellajs')

const env = process.env

const fetchOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (X11; Linux i686; rv:94.0) Gecko/20100101 Firefox/94.0'
  },
  timeout: 30 * 1e3,
  redirect: 'follow'
}

const sanitizeHtmlOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'u', 'b', 'i', 'em', 'strong',
    'div', 'span', 'p', 'article', 'blockquote', 'section',
    'pre', 'code',
    'ul', 'ol', 'li', 'dd', 'dl',
    'table', 'th', 'tr', 'td', 'thead', 'tbody', 'tfood',
    'label',
    'fieldset', 'legend',
    'img', 'picture',
    'br', 'p', 'hr',
    'a'
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt']
  }
}

const parserOptions = {
  env: env.ENV || 'dev',
  wordsPerMinute: 300, // to estimate "time to read"
  urlsCompareAlgorithm: 'levenshtein', // to find best url from list
  descriptionLengthThreshold: 40, // min num of chars allowed in description
  descriptionTruncateLen: 156, // max num of chars generated for description
  contentLengthThreshold: 200 // min num of chars allowed in content
}

module.exports = {
  getParserOptions: () => {
    return clone(parserOptions)
  },
  getFetchOptions: () => {
    return clone(fetchOptions)
  },
  getSanitizeHtmlOptions: () => {
    return clone(sanitizeHtmlOptions)
  },
  setParserOptions: (opts) => {
    copies(opts, parserOptions)
  },
  setFetchOptions: (opts) => {
    copies(opts, fetchOptions)
  },
  setSanitizeHtmlOptions: (opts) => {
    copies(opts, sanitizeHtmlOptions)
    if (Array.isArray(opts.allowedTags)) {
      sanitizeHtmlOptions.allowedTags = [...opts.allowedTags]
    }
  }
}
