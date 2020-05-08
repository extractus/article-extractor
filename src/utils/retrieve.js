// utils -> retrieve

const fetch = require('node-fetch');

const {
  error,
  info,
} = require('./logger');

const {getNodeFetchOptions} = require('../config');

module.exports = async (url) => {
  try {
    const res = await fetch(url, getNodeFetchOptions());
    if (res.status !== 200) {
      error(`Got ${res.status} error code from "${url}"`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType || !contentType.startsWith('text/')) {
      error(`Got invalid content-type (${contentType}) from "${url}"`);
      return null;
    }

    info(`Loaded remote HTML content from "${url}"`);
    const html = await res.text();
    const resUrl = res.url;

    const result = {
      url,
      resUrl,
      html,
    };

    return result;
  } catch (err) {
    error(`Could not fetch HTML content from "${url}"`);
    error(err);
  }
  return null;
};
