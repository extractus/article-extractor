/**
 * Article parser
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

var debug = require('debug');
var info = debug('artparser:info');
var error = debug('artparser:error');

var {
  md5
} = require('bellajs');

var {
  fetchOptions,
  configure,
  getConfig
} = require('./config');

var {
  isValidURL,
  removeUTM,
  cache,
  loadHTML
} = require('./utils');

var extractWithEmbedly = require('./parsers/extractWithEmbedly');

var parse = require('./parsers');

var extract = async (inputURL = '') => {
  try {

    if (!isValidURL(inputURL)) {
      throw new Error(`Invalid URL: ${inputURL}`);
    }

    info(`Start extracting "${inputURL}"`);

    let _url = removeUTM(inputURL);
    let id = md5(_url);

    let stored = cache.get(id);
    if (stored) {
      return stored;
    }

    let {
      url,
      html
    } = await loadHTML(_url, fetchOptions);

    let article = await parse({_url, url, html});
    cache.set(id, article);
    info(`Finish extracting "${inputURL}"`);

    return article;
  } catch (err) {
    error(err);
    return err;
  }
};

(async () => {
  let a = await extract('http://www.theapemachine.com/blog/ai-and-the-reversal-of-our-evolution');
  info(a);
})();

module.exports = {
  configure,
  getConfig,
  extract,
  extractWithEmbedly
};
