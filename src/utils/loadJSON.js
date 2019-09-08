// utils -> loadJSON

const {
  error,
  info,
} = require('./logger');

const fetch = require('node-fetch');

const cache = require('./store').contentLoadedCache;

const loadJSON = (url, opts = {}) => {
  return new Promise((resolve, reject) => {
    const stored = cache.get(url);
    if (stored) {
      info(`Got JSON from cache: ${url}`);
      return resolve(stored);
    }

    fetch(url, opts)
      .then(async (res) => {
        const {
          ok,
          status,
        } = res;
        if (!ok || status !== 200) {
          return reject(new Error(`Fetching failed for ${url}`));
        }
        info(`Loaded remote JSON content: ${url}`);
        return {
          url: res.url,
          json: await res.json(),
        };
      })
      .then((data) => {
        info(`Finish fetching JSON content for ${url}`);
        cache.set(url, data);
        return resolve(data);
      }).catch((err) => {
        const msg = `Error while fetching remote JSON from "${url}"`;
        error(err);
        return reject(new Error(msg));
      });
  });
};

module.exports = loadJSON;
