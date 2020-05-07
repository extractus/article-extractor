// utils/extractWithReadability

const {Readability} = require('readabilitySAX');
const Parser = require('htmlparser2/lib/Parser.js');

const {
  error,
} = require('../utils/logger');

module.exports = async (html) => {
  try {
    const readable = new Readability();
    const parser = new Parser(readable, {});
    parser.write(html);
    const article = await readable.getArticle();
    return article.html;
  } catch (err) {
    error(err);
  }
  return null;
};
