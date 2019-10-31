// utils -> chooseBestURL

import {
  slugify,
} from 'bellajs';

import stringComparision from 'string-comparison';

import {
  error,
} from './logger';


export default (candidates = [], title) => {
  let theBest = candidates.reduce((prev, curr) => {
    return curr.length < prev.length ? curr : prev;
  }, candidates[0]);

  try {
    const ls = stringComparision.levenshtein;
    const titleHashed = slugify(title);
    let g = ls.similarity(theBest, titleHashed);

    candidates.forEach((url) => {
      const k = ls.similarity(url, titleHashed);
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
