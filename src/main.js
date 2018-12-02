/**
 * Article parser
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

const {
  md5,
} = require('bellajs');


const config = require('./config');

const {
  fetchOptions,
  configure,
} = config;

const {
  isValidURL,
  removeUTM,
  loadHTML,
  logger,
  store,
} = require('./utils');

const cache = store.extractedCache;

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
  getConfig: () => {
    return config;
  },
  configure,
  extract,
  extractWithEmbedly,
};
