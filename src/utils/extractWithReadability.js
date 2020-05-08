// utils/extractWithReadability

const {Readability} = require('readabilitySAX');
const Parser = require('htmlparser2/lib/Parser.js');

module.exports = async (html) => {
  const readable = new Readability();
  const parser = new Parser(readable, {});
  parser.write(html);
  const article = await readable.getArticle();
  return article && article.html !== 'null' ? article.html : null;
};
