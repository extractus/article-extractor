/**
 * uri -> check if a url is in the blacklist
 * @ndaidong
 **/

var bella = require('bellajs');

var config = require('../config');

var isInBlackList = (url) => {
  if (!bella.isString(url)) {
    return false;
  }
  return config.blackList.some((c) => {
    return url.match(c);
  });
};

module.exports = isInBlackList;
