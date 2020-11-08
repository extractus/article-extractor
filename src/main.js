/**
 * Article parser
 * @ndaidong
 **/

const {
  isString,
  unique,
} = require('bellajs');

const {hasProvider, extract: extractOembed} = require('oembed-parser');

const retrieve = require('./utils/retrieve');
const isValidUrl = require('./utils/isValidUrl');
const normalizeUrl = require('./utils/normalizeUrl');
const parseFromHtml = require('./utils/parseFromHtml');

const {
  info,
} = require('./utils/logger');

const {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
} = require('./config');


const extract = async (input) => {
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

  if (!isValidUrl(input)) {
    return parseFromHtml(input, []);
  }

  const trimmedUrl = input.trim();

  if (isValidUrl(trimmedUrl)) {
    const normalizedUrl = normalizeUrl(trimmedUrl);
    const links = [trimmedUrl, normalizedUrl];
    article.url = normalizedUrl;
    if (hasProvider(normalizedUrl)) {
      info('Provider found, loading as oEmbed data...');
      const json = await extractOembed(normalizedUrl);
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

    const result = parseFromHtml(html, [...links, url, resUrl]);
    if (result) {
      return result;
    }
  }
  return null;
};

module.exports = {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
  extract,
};
