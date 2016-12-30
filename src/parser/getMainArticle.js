/*
 * parser -> extract metadata from given link or html
 * @ndaidong
*/

var cheerio = require('cheerio');
var sanitize = require('sanitize-html');
var read = require('es6-readability');

var debug = require('debug');
var error = debug('artparser:error');
var info = debug('artparser:info');

var config = require('../config');

var extractByClass = (input) => {

  info('Extracting by class name...');

  let {
    content,
    html
  } = input;

  let $ = cheerio.load(html);

  if ($) {

    let classes = [
      '.post-content noscript',
      '.post-body',
      '.post-content',
      '.article-body',
      '.article-content',
      '.entry-inner',
      '.post',
      'article'
    ];

    for (let i = 0; i < classes.length; i++) {
      let c = $(classes[i]);
      if (c) {
        content = c.html();
        input.content = content;
        if (content) {
          break;
        }
      }
    }
  }

  info('Finish extracting by class name.');
  info(`Content length: ${content.length}`);

  return Promise.resolve(input);
};

var extractWithReadability = (input) => {

  info('Extracting using es6-readability...');

  let {
    content,
    html
  } = input;

  if (!content) {
    return Promise.resolve(input);
  }

  return read(html).then((a) => {
    info('Finish extracting using es6-readability.');
    if (a && a.content && !content) {
      info('Use content extracted with es6-readability.');
      content = a.content;
    }
    return Promise.resolve({
      content,
      html
    });
  }).catch((err) => {
    error('Failed while extracting using es6-readability.');
    error(err);
    return Promise.resolve(input);
  });
};

var normalize = (input) => {

  info('Normalizing article content...');

  let {
    content
  } = input;

  if (content) {
    let s = sanitize(content, config.htmlRules);
    let $ = cheerio.load(s, {
      normalizeWhitespace: true,
      decodeEntities: true
    });

    $('a').attr('target', '_blank');
    input.content = $.html();
  }

  return Promise.resolve(input);
};

var getArticle = (html) => {
  return extractByClass({
    html,
    content: ''
  })
  .then(extractWithReadability)
  .then(normalize)
  .then((input) => {
    return Promise.resolve(input.content);
  });
};

module.exports = getArticle;
