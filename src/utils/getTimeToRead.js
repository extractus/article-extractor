// utils -> getTimeToRead

let {
  stripTags
} = require('bellajs');

var {
  wordsPerMinute
} = require('../config');

var getTimeToRead = (content) => {
  let text = stripTags(content);
  let words = text.trim().split(/\s+/g).length;
  let minToRead = words / wordsPerMinute;
  let secToRead = Math.ceil(minToRead * 60);
  return secToRead;
};

module.exports = getTimeToRead;
