/**
 * Article parser
 * @ndaidong
 **/

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

const parse = require('./parsers');

const extract = async (inputURL = '') => {
  try {
    if (!isValidURL(inputURL)) {
      throw new Error(`Invalid URL: ${inputURL}`);
    }

    info(`Start extracting "${inputURL}"`);

    const _url = removeUTM(inputURL);
    const id = md5(_url);

    const stored = cache.get(id);
    if (stored) {
      return stored;
    }

    const {
      url,
      html,
    } = await loadHTML(_url, fetchOptions);

    const article = await parse({_url, url, html});
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
};
