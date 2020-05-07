// utils -> isHtmlDoc

const cheerio = require('cheerio');

const {
  isString,
} = require('bellajs');

module.exports = (input = '') => {
  if (!isString(input)) {
    return false;
  }

  const $ = cheerio.load(input, {
    lowerCaseTags: true,
    lowerCaseAttributeNames: true,
    recognizeSelfClosing: true,
  });

  const htmlTags = $('html').length;
  const headTags = $('head').length;
  const bodyTags = $('body').length;
  const divTags = $('div').length;

  return htmlTags === 1 && headTags === 1 && bodyTags === 1 && divTags > 10;
};
