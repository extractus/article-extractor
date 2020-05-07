// utils -> absolutifyUrl

const {parse, resolve} = require('url');

const {isString} = require('bellajs');

const isValidUrl = require('./isValidUrl');

module.exports = (fullUrl, relativeUrl) => {
  if (!isValidUrl(fullUrl) || !isString(relativeUrl)) {
    return '';
  }
  const parsed = parse(fullUrl);
  const first = [parsed.protocol, parsed.host].join('//');
  return resolve(first, relativeUrl);
};
