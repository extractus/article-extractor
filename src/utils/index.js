var isValidURL = require('./isValidURL');
var removeUTM = require('./removeUTM');
var absolutifyURL = require('./absolutifyURL');
var chooseBestURL = require('./chooseBestURL');

var getTimeToRead = require('./getTimeToRead');
var getYtid = require('./getYtid');
var toSecond = require('./toSecond');

var cache = require('./cache');
var loadHTML = require('./loadHTML');
var loadJSON = require('./loadJSON');

var findExtension = require('./findExtension');
var standalizeArticle = require('./standalizeArticle');

module.exports = {
  isValidURL,
  removeUTM,
  absolutifyURL,
  chooseBestURL,
  getTimeToRead,
  getYtid,
  toSecond,
  cache,
  loadHTML,
  loadJSON,
  findExtension,
  standalizeArticle
};
