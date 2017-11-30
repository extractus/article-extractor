// utils -> cache

const lru = require('lru-cache');
const cache = lru({
  max: 500,
  maxAge: 20 * 6e4,
});

module.exports = cache;
