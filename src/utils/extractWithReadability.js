// utils/extractWithReadability

import read from 'es6-readability';

import {
  error,
} from '../utils/logger';

export default async (html) => {
  try {
    const article = await read(html);
    return article.content;
  } catch (err) {
    error(err);
    return null;
  }
};
