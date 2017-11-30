// utiles/extractWithReadability

const read = require('es6-readability');

const {
  info,
} = require('../utils/logger');

const extractWithReadability = (html) => {
  info('Extracting using es6-readability...');
  return read(html).then((a) => {
    return a.content;
  });
};

module.exports = extractWithReadability;
