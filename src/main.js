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

var extract = (url = '') => {
  return new Promise((resolve, reject) => {
    if (!isValidURL(url)) {
      throw new Error('Invalid URL');
    }
    let _url = removeUTM(url);
    let id = md5(_url);
    let stored = cache.get(id);
    if (stored) {
      return resolve(stored);
    }

    return loadHTML(_url, fetchOptions).then((html) => {
      return parse({url: _url, html});
    }).then((article) => {
      cache.set(id, article);
      return resolve(article);
    }).catch((err) => {
      return reject(err);
    });
  });
};

let url = 'https://youtu.be/tRGJj59G1x4';

extract(url).then((article) => {
  console.log(article);
}).catch((err) => {
  console.log(err);
});

module.exports = {
  configure,
  getConfig,
  extract,
  extractWithEmbedly
};
