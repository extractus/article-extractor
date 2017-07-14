// utils -> absolutifyURL

var URL = require('url');

var {
  isString
} = require('bellajs');

var isValidURL = require('./isValidURL');

var absolutify = (fullUrl, relativeUrl) => {
  if (!isValidURL(fullUrl) || !isString(relativeUrl)) {
    return '';
  }
  let parsed = URL.parse(fullUrl);
  let first = [parsed.protocol, parsed.host].join('//');
  return URL.resolve(first, relativeUrl);
};

module.exports = absolutify;
