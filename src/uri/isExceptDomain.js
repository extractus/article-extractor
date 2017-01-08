/**
 * uri -> check if a url is in ignore list
 * @ndaidong
 **/

var bella = require('bellajs');

var config = require('../config');

var isExceptDomain = (url) => {
  if (!bella.isString(url)) {
    return false;
  }
  return config.exceptDomain.some((c) => {
    return url.match(c);
  });
};

module.exports = isExceptDomain;
