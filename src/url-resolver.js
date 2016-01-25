/**
 * url-resolver
 * @ndaidong
 **/

'use strict';

var URL = require('url');

var config = require('./config');

var isInBlackList = (url) => {
  return config.blackList.some((c) => {
    return url.match(c);
  });
};

var isAdsDomain = (url) => {
  return config.adsDomain.some((c) => {
    return url.match(c);
  });
};

var isExceptDomain = (url) => {
  return config.exceptDomain.some((c) => {
    return url.match(c);
  });
};

var isValidURL = (str) => {
  if (!str) {
    return false;
  }
  if (isInBlackList(str)) {
    return false;
  }
  let pattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.) {3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?$', 'i');
  if (!pattern.test(str)) {
    return false;
  }
  return true;
};

var removeUTM = (url) => {
  if (url.includes('#')) {
    let a1 = url.split('#');
    url = a1[0];
  }
  let arr = url.split('?');
  if (arr.length > 1) {
    let s = arr[1];
    return [arr[0], s.split('&').filter((v) => {
      return !/^utm_/.test(v) && !/^pk_/.test(v);
    }).join('&')].join('?');
  }
  return url;
};

var purifyURL = (url) => {
  url = removeUTM(url);
  if (!isValidURL(url)) {
    return false;
  }
  let g = URL.parse(url);
  let u = [g.protocol, '//', g.host, g.pathname].join('');
  let isBad = isAdsDomain(url) || !g.search || g.search.indexOf('=') === -1;
  if (isBad) {
    return u;
  }
  return u + g.search;
};

var getDomain = (url) => {
  if (!isValidURL(url)) {
    return false;
  }
  let g = URL.parse(url);
  return g.host;
};

module.exports = {
  isValidURL: isValidURL,
  isAdsDomain: isAdsDomain,
  isExceptDomain: isExceptDomain,
  purifyURL: purifyURL,
  removeUTM: removeUTM,
  getDomain: getDomain
};
