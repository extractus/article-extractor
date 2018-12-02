// utils -> getTimeToRead

const {
  stripTags,
} = require('bellajs');


const {
  wordsPerMinute,
} = require('../config');

const getTimeToRead = (content) => {
  let text = stripTags(content);
  let words = text.trim().split(/\s+/g).length;
  let minToRead = words / wordsPerMinute;
  let secToRead = Math.ceil(minToRead * 60);
  return secToRead;
};

module.exports = getTimeToRead;
