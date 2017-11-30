// utils -> chooseBestURL

const {
  error,
} = require('./logger');

const {
  JaroWinklerDistance: compare,
} = require('natural');

const chooseBestURL = (candidates = [], titleHashed) => {
  let theBest = candidates[0];
  candidates.forEach((url) => {
    if (url.length > theBest.length) {
      theBest = url;
    }
  });

  try {
    let g = compare(theBest, titleHashed);

    candidates.forEach((url) => {
      let k = compare(url, titleHashed);
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

module.exports = chooseBestURL;
