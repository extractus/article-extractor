// utiles/extractWithReadability

var read = require('es6-readability');

var debug = require('debug');
var info = debug('artparser:info');

var extractWithReadability = (html) => {
  info('Extracting using es6-readability...');
  return read(html).then((a) => {
    return a.content;
  });
};

module.exports = extractWithReadability;
