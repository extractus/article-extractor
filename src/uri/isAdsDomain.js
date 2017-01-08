/**
 * uri -> check if a url came from an adv page
 * @ndaidong
 **/

var bella = require('bellajs');

var config = require('../config');

var isAdsDomain = (url) => {
  if (!bella.isString(url)) {
    return false;
  }
  return config.adsDomain.some((c) => {
    return url.match(c);
  });
};

module.exports = isAdsDomain;
