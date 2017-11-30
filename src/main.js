/**
 * Article parser
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

const {
  md5,
} = require('bellajs');

const {
  fetchOptions,
  configure,
  getConfig,
} = require('./config');

const {
  isValidURL,
  removeUTM,
  cache,
  loadHTML,
  logger,
} = require('./utils');

const {
  error,
  info,
} = logger;

const extractWithEmbedly = require('./parsers/extractWithEmbedly');

const parse = require('./parsers');

const extract = async (inputURL = '') => {
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
      html,
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

module.exports = {
  configure,
  getConfig,
  extract,
  extractWithEmbedly,
};
