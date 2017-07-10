var isValidURL = require('./isValidURL');
var removeUTM = require('./removeUTM');
var absolutifyURL = require('./absolutifyURL');

var cache = require('./cache');
var loadHTML = require('./loadHTML');

var findExtension = require('./findExtension');
var standalizeArticle = require('./standalizeArticle');

module.exports = {
  isValidURL,
  removeUTM,
  absolutifyURL,
  cache,
  loadHTML,
  findExtension,
  standalizeArticle
};
