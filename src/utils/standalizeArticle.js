// utils -> standalizeArticle

var cheerio = require('cheerio');
var sanitize = require('sanitize-html');

var salient = require('salient');
var tokenizer = new salient.tokenizers.ArticleTokenizer({
  compressWhitespace: true,
  cleanHTML: false,
  cleanNonAlphaNumeric: false,
  preserveEmoticons: true
});

var {
  stripTags,
  truncate
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

    let cleanHtml = tokenizer.clean(html);

    let $ = cheerio.load(cleanHtml, {
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

    let content = sanitize($.html(), contentOnlyRule);
    input.content = content;

    let text = stripTags(content);
    let s = description || text;
    input.description = truncate(s, 156);

    input.duration = getTimeToRead(text);
  }
  return input;
};

module.exports = standalize;
