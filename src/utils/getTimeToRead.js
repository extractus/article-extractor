// utils -> getTimeToRead

const {
  stripTags,
} = require('bellajs');


const {
  wordsPerMinute,
} = require('../config');

const getTimeToRead = (content) => {
  const text = stripTags(content);
  const words = text.trim().split(/\s+/g).length;
  const minToRead = words / wordsPerMinute;
  const secToRead = Math.ceil(minToRead * 60);
  return secToRead;
};

module.exports = getTimeToRead;
