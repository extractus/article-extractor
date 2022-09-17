// configs

import { clone } from 'bellajs'

const sanitizeHtmlOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
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
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    a: ['href', 'target', 'title'],
    abbr: ['title'],
    progress: ['value', 'max'],
    img: ['src', 'srcset', 'alt', 'title'],
    picture: ['media', 'srcset'],
    video: ['controls', 'width', 'height', 'autoplay', 'muted', 'loop', 'src'],
    audio: ['controls', 'width', 'height', 'autoplay', 'muted', 'loop', 'src'],
    source: ['src', 'srcset', 'data-srcset', 'type', 'media', 'sizes'],
    iframe: ['src', 'frameborder', 'height', 'width', 'scrolling', 'allow'],
    svg: ['width', 'height'] // sanitize-html does not support svg fully yet
  },
  allowedIframeDomains: [
    'youtube.com', 'vimeo.com', 'odysee.com',
    'soundcloud.com', 'audius.co',
    'github.com', 'codepen.com',
    'twitter.com', 'facebook.com', 'instagram.com'
  ]
}

const parserOptions = {
  wordsPerMinute: 300, // to estimate "time to read"
  urlsCompareAlgorithm: 'levenshtein', // to find the best url from list
  descriptionLengthThreshold: 180, // min num of chars required for description
  descriptionTruncateLen: 210, // max num of chars generated for description
  contentLengthThreshold: 200 // content must have at least 200 chars
}

const state = {
  sanitizeHtmlOptions,
  parserOptions
}

/**
 * @returns {SanitizeOptions}
 */
export const getSanitizeHtmlOptions = () => {
  return clone(state.sanitizeHtmlOptions)
}

/**
 * @returns {ParserOptions}
 */
export const getParserOptions = () => {
  return clone(state.parserOptions)
}

export const setParserOptions = (opts = {}) => {
  Object.keys(state.parserOptions).forEach((key) => {
    if (key in opts) {
      state.parserOptions[key] = opts[key]
    }
  })
}

export const setSanitizeHtmlOptions = (opts = {}) => {
  Object.keys(opts).forEach((key) => {
    state.sanitizeHtmlOptions[key] = clone(opts[key])
  })
}
