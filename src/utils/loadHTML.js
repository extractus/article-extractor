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
      .then((res) => {
        let {
          ok,
          status,
          headers
        } = res;
        if (!ok || status !== 200) {
          return reject(new Error(`Fetching failed for ${url}`));
        }
        let contentType = headers.get('content-type');
        if (!contentType.startsWith('text/')) {
          return reject(new Error(`Could not handle ${contentType}`));
        }
        info(`Loaded remote HTML content: ${url}`);
        return res.text();
      })
      .then((html) => {
        info(`Finish fetching HTML content for ${url}`);
        if (!html) {
          info('Returned HTML is empty. Exit process.');
          return reject(new Error(`No HTML content retrieved for ${url}`));
        }
        cache.set(url, html);
        return resolve(html);
      }).catch((err) => {
        error(`Error while fetching remote HTML from "${url}"`);
        return reject(err);
      });
  });
};

module.exports = loadHTML;
