// configs

const {clone, copies} = require('bellajs');

const {name, version} = require('../package.json');

const env = process.env;

const nodeFetchOptions = {
  headers: {
    'user-agent': `${name}/${version}`,
  },
  timeout: 30 * 1e3,
  redirect: 'follow',
  compress: true,
  agent: false,
};

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
    'a',
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'alt'],
  },
};

const parserOptions = {
  env: env.ENV || 'dev',
  wordsPerMinute: 300, // to estimate "time to read"
  urlsCompareAlgorithm: 'levenshtein', // to find best url from list
  descriptionLengthThreshold: 40, // min num of chars allowed in description
  descriptionTruncateLen: 156, // max num of chars generated for description
  contentLengthThreshold: 200, // min num of chars allowed in content
};

module.exports = {
  getParserOptions: () => {
    return clone(parserOptions);
  },
  getNodeFetchOptions: () => {
    return clone(nodeFetchOptions);
  },
  getSanitizeHtmlOptions: () => {
    return clone(sanitizeHtmlOptions);
  },
  setParserOptions: (opts) => {
    copies(opts, parserOptions);
  },
  setNodeFetchOptions: (opts) => {
    copies(opts, nodeFetchOptions);
  },
  setSanitizeHtmlOptions: (opts) => {
    copies(opts, sanitizeHtmlOptions);
    if (Array.isArray(opts.allowedTags)) {
      sanitizeHtmlOptions.allowedTags = [...opts.allowedTags];
    }
  },
};
