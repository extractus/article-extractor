// utils -> standalizeArticle

import cheerio from 'cheerio';
import sanitize from 'sanitize-html';

import {minify as htmlmin} from 'html-minifier';

import absolutifyUrl from './absolutifyUrl';
import {getSanitizeHtmlOptions} from '../config';

export default (htmlArticle, url) => {
  const $ = cheerio.load(htmlArticle, {
    normalizeWhitespace: true,
    decodeEntities: true,
  });

  $('a').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href) {
      $(elem).attr('href', absolutifyUrl(url, href));
      $(elem).attr('target', '_blank');
    }
  });

  $('img').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src) {
      $(elem).attr('src', absolutifyUrl(url, src));
    }
  });

  const minifiedHtml = htmlmin($.html(), {
    removeComments: true,
    removeEmptyElements: true,
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    removeTagWhitespace: true,
  });

  const cleanHtml = sanitize(minifiedHtml, getSanitizeHtmlOptions());
  return cleanHtml.trim();
};
