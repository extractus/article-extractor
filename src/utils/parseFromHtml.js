// utils -> parseFromHtml

import {parse} from 'url';

import {
  unique,
  stripTags,
  truncate,
} from 'bellajs';

import sanitize from 'sanitize-html';

import extractMetaData from './extractMetaData';
import chooseBestUrl from './chooseBestUrl';
import absolutifyUrl from './absolutifyUrl';
import normalizeUrl from './normalizeUrl';
import isValidUrl from './isValidUrl';
import standalizeArticle from './standalizeArticle';
import extractWithRules from './extractWithRules';
import extractWithReadability from './extractWithReadability';
import getTimeToRead from './getTimeToRead';

import {getParserOptions} from '../config';

import {
  info,
} from './logger';


const cleanify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
  });
};

const summarize = (desc, txt, threshold, maxlen) => {
  return desc.length < threshold ? truncate(txt, maxlen) : desc;
};

const getSource = (source, uri) => {
  return source ? source : (() => {
    const {hostname} = parse(uri);
    return hostname;
  })();
};

export default async (input, links) => {
  info('Start parsing from HTML...');
  const html = cleanify(input);
  const meta = extractMetaData(html);

  const {
    title = '',
    description = '',
    image = '',
    author = '',
    source = '',
    published = '',
  } = meta;


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

  if (!title || links.length === 0) {
    info('No `title` or `url`, stop processing');
    return null;
  }

  info('Extracting main article...');
  const mainText = extractWithRules(html) || await extractWithReadability(html);

  if (!mainText) {
    info('Could not extract main article, stop processing');
    return null;
  }

  info('Finding the best link...');
  const ulinks = unique(links.filter(isValidUrl).map(normalizeUrl));
  const bestUrl = chooseBestUrl(ulinks, title);

  info('Normalizing content');
  const {
    descriptionLengthThreshold,
    descriptionTruncateLen,
    contentLengthThreshold,
  } = getParserOptions();

  const normalizedContent = standalizeArticle(mainText, bestUrl);
  const textContent = stripTags(normalizedContent);
  if (textContent.split(' ').length < contentLengthThreshold) {
    info('Main article is too short!');
    return null;
  }


  info('Finish parsing process');
  return {
    url: bestUrl,
    title,
    description: summarize(
      description,
      textContent,
      descriptionLengthThreshold,
      descriptionTruncateLen
    ),
    links: ulinks,
    image: image ? absolutifyUrl(bestUrl, image) : '',
    content: normalizedContent,
    author,
    source: getSource(source, bestUrl),
    published,
    ttr: getTimeToRead(textContent),
  };
};
