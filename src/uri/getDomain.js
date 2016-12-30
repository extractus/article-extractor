/**
 * uri -> get domain from given url
 * @ndaidong
 **/

var URL = require('url');

var isValidURL = require('./isValidURL');

var getDomain = (url) => {
  if (!isValidURL(url)) {
    return false;
  }
  let g = URL.parse(url);
  let dom = g.host;
  if (dom.startsWith('www.')) {
    return dom.slice(4);
  }
  return dom;
};

module.exports = getDomain;
