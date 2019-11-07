// utils -> parseFromHtml

import {
  unique,
  stripTags,
  truncate,
} from 'bellajs';

import extractMetaData from './extractMetaData';
import chooseBestUrl from './chooseBestUrl';
import absolutifyUrl from './absolutifyUrl';
import normalizeUrl from './normalizeUrl';
import isValidUrl from './isValidUrl';
import standalizeArticle from './standalizeArticle';
import extractWithRules from './extractWithRules';
import extractWithReadability from './extractWithReadability';
import getTimeToRead from './getTimeToRead';

import {
  info,
} from './logger';

const MAX_DESC_LENGTH = 156;


export default (html, links, article) => {
  info('Start parsing from HTML...');
  const meta = extractMetaData(html);
  article.title = meta.title || '';
  article.description = meta.description || '';

  [
    'title',
    'description',
    'image',
    'author',
    'source',
    'published',
  ].forEach((p) => {
    article[p] = meta[p] || '';
  });

  [
    'url',
    'shortlink',
    'amphtml',
    'canonical',
  ].forEach((p) => {
    if (meta[p]) {
      links.push(meta[p]);
    }
  });

  if (!article.title || links.length === 0) {
    info('No `title` or `url`, stop processing');
    info(article);
    return null;
  }

  info('Extracting main article...');
  const mainText = extractWithRules(html) || extractWithReadability(html);

  if (!mainText) {
    info('Could not extract main article, stop processing');
    return null;
  }

  info('Finding the best link...');
  article.links = unique(links.filter(isValidUrl).map(normalizeUrl));
  const bestUrl = chooseBestUrl(article.links, article.title);
  article.url = bestUrl;

  info('Normalizing content');
  if (article.image) {
    article.image = absolutifyUrl(bestUrl, article.image);
  }
  const normalizedContent = standalizeArticle(mainText, bestUrl);
  const textContent = stripTags(normalizedContent);
  if (!article.description) {
    article.description = truncate(textContent, MAX_DESC_LENGTH);
  }
  article.content = normalizedContent;
  article.ttr = getTimeToRead(normalizedContent);
  info('Finish parsing process');
  return article;
};
