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

var {
  stripTags
} = require('bellajs');

var config = require('../config');

var extractByClass = (input) => {

  info('Extracting by class name...');

  let {
    html
  } = input;

  let content = '';

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
        if (content) {
          input.contentByClassName = content;
          info(`Content extracted with class name: ${content.length}`);
          break;
        }
      }
    }
  }

  info('Finish extracting by class name.');

  return Promise.resolve(input);
};

var extractWithReadability = (input) => {

  return new Promise((resolve) => {
    info('Extracting using es6-readability...');

    let {
      html
    } = input;

    read(html).then((a) => {
      info('Finish extracting using es6-readability.');
      if (a && a.content) {
        let content = a.content;
        info(`Content extracted with es6-readability: ${content.length}`);
        input.contentByReadability = content;
      }
      return resolve(input);
    }).catch((err) => {
      error('Failed while extracting using es6-readability.');
      error(err);
      return resolve(input);
    });
  });
};

var cleanify = (html = '') => {
  if (html) {
    let s = sanitize(html, config.htmlRules);
    let $ = cheerio.load(s, {
      normalizeWhitespace: true,
      decodeEntities: true
    });

    $('a').attr('target', '_blank');
    html = $.html().replace('<html><head></head><body>', '')
      .replace('</body></html>', '');
  }
  return html;
};

var normalize = (input) => {

  info('Normalizing article content...');

  let {
    content = '',
    contentByClassName = '',
    contentByReadability = ''
  } = input;

  let c1 = cleanify(contentByClassName);
  let c2 = cleanify(contentByReadability);

  let s1 = stripTags(c1);
  let s2 = stripTags(c2);

  content = s1.length < s2.length ? c1 : c2;

  return Promise.resolve(content);
};

var getArticle = (html) => {
  return new Promise((resolve, reject) => {
    info('Start extracting article from HTML');
    extractByClass({
      html,
      content: ''
    }).then(extractWithReadability)
      .then(normalize)
      .then((pureContent) => {
        info('Finish extracting article from HTML');
        return resolve(pureContent);
      }).catch((err) => {
        error('Something wrong when extracting article from HTML');
        error(err);
        return reject(err);
      });
  });
};

module.exports = getArticle;
