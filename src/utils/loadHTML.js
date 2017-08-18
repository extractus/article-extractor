// utils -> loadHTML

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var fetch = require('node-fetch');

var lru = require('lru-cache');
var cache = lru({
  max: 1000,
  maxAge: 24 * 60 * 6e4
});

var loadHTML = (url, opts = {}) => {
  return new Promise((resolve, reject) => {
    let stored = cache.get(url);
    if (stored) {
      info(`Got HTML from cache: ${url}`);
      return resolve(stored);
    }

    fetch(url, opts)
      .then(async (res) => {
        let {
          ok,
          status,
          headers
        } = res;
        if (!ok || status !== 200) {
          throw new Error(`Fetching failed for "${url}"`);
        }
        let contentType = headers.get('content-type') || '';
        if (!contentType || !contentType.startsWith('text/')) {
          throw new Error(`Error with contentType "${contentType}"`);
        }
        info(`Loaded remote HTML content: ${url}`);
        return {
          url: res.url,
          html: await res.text()
        };
      })
      .then((data) => {
        info(`Finish fetching HTML content for ${url}`);
        cache.set(url, data);
        return resolve(data);
      }).catch((err) => {
        error(err);
        return reject(err);
      });
  });
};

module.exports = loadHTML;
