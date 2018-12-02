// utils -> store

const LRU = require('lru-cache');

const extractedCache = new LRU({
  max: 500,
  maxAge: 20 * 6e4,
});

const contentLoadedCache = new LRU({
  max: 1000,
  maxAge: 3 * 24 * 60 * 6e4,
});

module.exports = {
  extractedCache,
  contentLoadedCache,
};
