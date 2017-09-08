// utils -> standalizeArticle

var cheerio = require('cheerio');
var sanitize = require('sanitize-html');

var htmlmin = require('html-minifier').minify;

var {
  stripTags,
  truncate,
  trim
} = require('bellajs');

var config = require('../config');
var contentOnlyRule = config.article.htmlRules;

var getTimeToRead = require('./getTimeToRead');
var absolutifyURL = require('./absolutifyURL');

var standalize = (input) => {
  let {
    content: html,
    description,
    url
  } = input;

  if (html) {

    let $ = cheerio.load(html, {
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


    let cleanHtml = htmlmin($.html(), {
      removeComments: true,
      removeEmptyElements: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeTagWhitespace: true
    });

    cleanHtml = sanitize(cleanHtml, contentOnlyRule);
    let content = trim(cleanHtml);
    input.content = content;

    let text = stripTags(content);
    let s = description || text;
    input.description = truncate(s, 156);

    input.duration = getTimeToRead(text);
  }
  return input;
};

module.exports = standalize;
