// utils -> loadJSON

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var fetch = require('node-fetch');

var lru = require('lru-cache');
var cache = lru({
  max: 1000,
  maxAge: 24 * 60 * 6e4
});

var loadJSON = (url, opts = {}) => {
  return new Promise((resolve, reject) => {
    let stored = cache.get(url);
    if (stored) {
      info(`Got JSON from cache: ${url}`);
      return resolve(stored);
    }

    fetch(url, opts)
      .then((res) => {
        let {
          ok,
          status
        } = res;
        if (!ok || status !== 200) {
          return reject(new Error(`Fetching failed for ${url}`));
        }
        info(`Loaded remote JSON content: ${url}`);
        return res.json();
      })
      .then((json) => {
        info(`Finish fetching JSON content for ${url}`);
        cache.set(url, json);
        return resolve(json);
      }).catch((err) => {
        error(`Error while fetching remote JSON from "${url}"`);
        return reject(err);
      });
  });
};

module.exports = loadJSON;
