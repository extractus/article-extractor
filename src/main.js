/**
 * Article parser
 * @ndaidong
 **/

import {
  md5,
  isString,
  unique,
} from 'bellajs';

import {hasProvider} from 'oembed-parser';

import retrieve from './utils/retrieve';
import parseOEmbed from './utils/parseOEmbed';
import isHtmlDoc from './utils/isHtmlDoc';
import isValidUrl from './utils/isValidUrl';
import isAccessibleUrl from './utils/isAccessibleUrl';
import normalizeUrl from './utils/normalizeUrl';
import parseFromHtml from './utils/parseFromHtml';

import {
  info,
} from './utils/logger';

import {extractedCache as cache} from './utils/store';

export {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
} from './config';


const setCache = (data) => {
  const {links = []} = data;
  if (links.length > 0) {
    links.forEach((link) => {
      const key = md5(link);
      cache.set(key, data);
    });
  }
};

export const extract = async (input) => {
  if (!isString(input)) {
    throw new Error('Input must be a string');
  }
  const article = {
    url: '',
    links: [],
    title: '',
    description: '',
    image: '',
    author: '',
    content: '',
    source: '',
    published: '',
    ttr: 0,
  };

  if (isHtmlDoc(input)) {
    return parseFromHtml(input, [], article);
  }

  const trimmedUrl = input.trim();

  if (isValidUrl(trimmedUrl)) {
    const normalizedUrl = normalizeUrl(trimmedUrl);
    const key = md5(normalizedUrl);
    const stored = cache.get(key);
    if (stored) {
      info(`Load article data from cache: ${normalizedUrl}`);
      return stored;
    }

    if (!isAccessibleUrl(normalizedUrl)) {
      throw new Error(`Could not access to "${normalizedUrl}"!`);
    }
    const links = [trimmedUrl, normalizedUrl];
    article.url = normalizedUrl;
    if (hasProvider(normalizedUrl)) {
      info('Provider found, loading as oEmbed data...');
      const json = await parseOEmbed(normalizedUrl);
      if (json) {
        article.title = json.title || '';
        article.content = json.html || '';
        article.author = json.author_name || '';
        article.image = json.thumbnail_url || '';
        article.source = json.provider_name || '';
        if (json.url) {
          article.url = json.url;
          links.push(json.url);
        }
        article.links = unique(links);
        setCache(article);
        return article;
      }
    }
    const res = await retrieve(normalizedUrl);
    if (!res) {
      throw new Error(`Could not retrieve content from "${normalizedUrl}"`);
    }
    const {
      html,
      url,
      resUrl,
    } = res;

    links.concat([url, resUrl]);
    const result = parseFromHtml(html, links, article);
    if (result) {
      setCache(result);
      return result;
    }
  }
  return null;
};
