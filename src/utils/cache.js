// utils -> cache

var lru = require('lru-cache');
var cache = lru({
  max: 500,
  maxAge: 20 * 6e4
});

module.exports = cache;
