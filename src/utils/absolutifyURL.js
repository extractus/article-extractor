// utils -> absolutifyURL

const URL = require('url');

const {
  isString,
} = require('bellajs');

const isValidURL = require('./isValidURL');

const absolutify = (fullUrl, relativeUrl) => {
  if (!isValidURL(fullUrl) || !isString(relativeUrl)) {
    return '';
  }
  let parsed = URL.parse(fullUrl);
  let first = [parsed.protocol, parsed.host].join('//');
  return URL.resolve(first, relativeUrl);
};

module.exports = absolutify;
