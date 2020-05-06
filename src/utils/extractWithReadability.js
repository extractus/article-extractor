// utils/extractWithReadability

import {Readability} from 'readabilitySAX';
import Parser from 'htmlparser2/lib/Parser.js';

import {
  error,
} from '../utils/logger';

export default async (html) => {
  try {
    const readable = new Readability();
    const parser = new Parser(readable, {});
    parser.write(html);
    const article = await readable.getArticle();
    return article.html;
  } catch (err) {
    error(err);
    return null;
  }
};
