// configs

import {clone, copies} from 'bellajs';

import {name, version} from '../package.json';

const env = process.env || {}; // eslint-disable-line no-process-env

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
  wordsPerMinute: 300,
  urlsCompareAlgorithm: 'levenshtein',
};

export const getParserOptions = () => {
  return clone(parserOptions);
};

export const getNodeFetchOptions = () => {
  return clone(nodeFetchOptions);
};

export const getSanitizeHtmlOptions = () => {
  return clone(sanitizeHtmlOptions);
};

export const setParserOptions = (opts) => {
  copies(opts, parserOptions);
};

export const setNodeFetchOptions = (opts) => {
  copies(opts, nodeFetchOptions);
};

export const setSanitizeHtmlOptions = (opts) => {
  copies(opts, sanitizeHtmlOptions);
  if (opts.allowedTags && opts.allowedTags.length > 0) {
    sanitizeHtmlOptions.allowedTags = [...opts.allowedTags];
  }
};

