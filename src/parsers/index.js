// parser

var debug = require('debug');
var error = debug('artparser:error');

var {
  findExtension,
  standalizeArticle
} = require('../utils');

var extractWithReadability = require('./extractWithReadability');

var parse = (input) => {
  return new Promise((resolve, reject) => {
    let {
      url,
      html
    } = input;

    let ext = findExtension(url);
    if (ext) {
      return ext.extract(url, html).then((art) => {
        return resolve(art);
      }).catch((err) => {
        return reject(err);
      });
    }

    return extractWithReadability(html)
      .then((content) => {
        input.content = content;
        input.html = '';
        return input;
      })
      .then(standalizeArticle)
      .then((art) => {
        console.log(art);
      })
      .catch((err) => {
        error(`Could not extract article from "${url}"`);
        return reject(err);
      });
  });
};

module.exports = parse;
