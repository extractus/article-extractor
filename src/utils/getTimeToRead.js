// utils -> getTimeToRead

const {
  getParserOptions,
} = require('../config');


module.exports = (text) => {
  const words = text.trim().split(/\s+/g).length;
  const {wordsPerMinute} = getParserOptions();
  const minToRead = words / wordsPerMinute;
  const secToRead = Math.ceil(minToRead * 60);
  return secToRead;
};

