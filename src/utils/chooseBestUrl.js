// utils -> chooseBestURL

import {
  slugify,
} from 'bellajs';

import stringComparision from 'string-comparison';

import {getParserOptions} from '../config';

import {
  error,
} from './logger';


export default (candidates = [], title) => {
  let theBest = candidates.reduce((prev, curr) => {
    return curr.length < prev.length ? curr : prev;
  }, candidates[0]);

  try {
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
  } catch (err) {
    error(err);
  }

  return theBest;
};
