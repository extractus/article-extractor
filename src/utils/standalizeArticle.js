// utils -> standalizeArticle

const cheerio = require('cheerio');
const sanitize = require('sanitize-html');

const htmlmin = require('html-minifier').minify;

const {
  stripTags,
  truncate,
} = require('bellajs');

const config = require('../config');
const contentOnlyRule = config.htmlRules;

const getTimeToRead = require('./getTimeToRead');
const absolutifyURL = require('./absolutifyURL');

const standalize = (input) => {
  const {
    content: html,
    description,
    url,
  } = input;

  if (html) {
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
      decodeEntities: true,
    });

    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        $(elem).attr('href', absolutifyURL(url, href));
        $(elem).attr('target', '_blank');
      }
    });

    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
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
      removeTagWhitespace: true,
    });

    cleanHtml = sanitize(cleanHtml, contentOnlyRule);
    const content = cleanHtml.trim();
    input.content = content;

    const text = stripTags(content);
    const s = description || text;
    input.description = truncate(s, 156);

    input.duration = getTimeToRead(text);
  }
  return input;
};

module.exports = standalize;
