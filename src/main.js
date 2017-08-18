/**
 * Article parser
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

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

    return article;
  } catch (err) {
    return err;
  }
};

module.exports = {
  configure,
  getConfig,
  extract,
  extractWithEmbedly
};
