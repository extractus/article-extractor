var isInBlackList = require('./isInBlackList');
var isAdsDomain = require('./isAdsDomain');
var isExceptDomain = require('./isExceptDomain');
var isValidURL = require('./isValidURL');
var isWikipedia = require('./isWikipedia');
var removeUTM = require('./removeUTM');
var absolutify = require('./absolutify');
var purify = require('./purify');
var getDomain = require('./getDomain');
var absolutifyContentSrc = require('./absolutifyContentSrc');

module.exports = {
  isInBlackList,
  isAdsDomain,
  isExceptDomain,
  isValidURL,
  isWikipedia,
  removeUTM,
  absolutify,
  purify,
  getDomain,
  absolutifyContentSrc
};
