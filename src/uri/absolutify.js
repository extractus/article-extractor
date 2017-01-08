/**
 * uri -> convert a relative url to absolute
 * @ndaidong
 **/

var URL = require('url');
var bella = require('bellajs');

var isValidURL = require('./isValidURL');

var absolutify = (fullUrl, relativeUrl) => {
  if (!isValidURL(fullUrl) || !bella.isString(relativeUrl)) {
    return '';
  }
  let parsed = URL.parse(fullUrl);
  let first = [parsed.protocol, parsed.host].join('//');
  return URL.resolve(first, relativeUrl);
};

module.exports = absolutify;
