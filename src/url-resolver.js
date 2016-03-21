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

  /* eslint-disable*/
  let pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  /* eslint-enable*/

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
    return [ arr[0], s.split('&').filter((v) => {
      return !/^utm_/.test(v) && !/^pk_/.test(v);
    }).join('&') ].join('?');
  }
  return url;
};

var absolutify = (fullUrl, relativeUrl) => {
  if (!relativeUrl || !fullUrl) {
    return '';
  }
  let parsed = URL.parse(fullUrl);
  let first = [ parsed.protocol, parsed.host ].join('//');
  return URL.resolve(first, relativeUrl);
};

var purify = (url) => {
  url = removeUTM(url);
  if (!isValidURL(url)) {
    return false;
  }
  let g = URL.parse(url);
  let u = [ g.protocol, '//', g.host, g.pathname ].join('');
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
  isInBlackList: isInBlackList,
  absolutify: absolutify,
  purify: purify,
  removeUTM: removeUTM,
  getDomain: getDomain
};
