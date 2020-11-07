// utils -> chooseBestURL

const {
  slugify,
} = require('bellajs');

const stringComparision = require('string-comparison');

const {getParserOptions} = require('../config');

module.exports = (candidates = [], title = '') => {
  let theBest = candidates.reduce((prev, curr) => {
    return curr.length < prev.length ? curr : prev;
  }, candidates[0]);

  const opts = getParserOptions();
  const alg = opts['urlsCompareAlgorithm'];
  const comparer = stringComparision[alg];

  const titleHashed = slugify(title);
  let g = comparer.similarity(theBest, titleHashed);

  candidates.forEach((url) => {
    const k = comparer.similarity(url, titleHashed);
    if (k > g) {
      g = k;
      theBest = url;
    }
  });

  return theBest;
};
