// utils -> standalizeArticle

var cheerio = require('cheerio');
var sanitize = require('sanitize-html');

var config = require('../config');
var contentOnlyRule = config.article.htmlRules;

var absolutifyURL = require('./absolutifyURL');

var standalize = (input) => {
  let {
    content: html,
    url
  } = input;

  if (html) {
    let s = sanitize(html, contentOnlyRule);
    let $ = cheerio.load(s, {
      normalizeWhitespace: true,
      decodeEntities: true
    });

    $('a').each((i, elem) => {
      let href = $(elem).attr('href');
      if (href) {
        $(elem).attr('href', absolutifyURL(url, href));
        $(elem).attr('target', '_blank');
      }
    });

    $('img').each((i, elem) => {
      let src = $(elem).attr('src');
      if (src) {
        $(elem).attr('src', absolutifyURL(url, src));
      }
    });
    input.content = $.html();
  }
  return input;
};

module.exports = standalize;
