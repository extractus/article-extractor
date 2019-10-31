// utils -> loadHTML

import fetch from 'node-fetch';
import {md5} from 'bellajs';

import {
  error,
  info,
} from './logger';

import {getNodeFetchOptions} from '../config';

import {contentLoadedCache as cache} from './store';

export default async (url) => {
  try {
    const key = md5(url);
    const stored = cache.get(key);
    if (stored) {
      info(`Load HTML from cache: ${url}`);
      return stored;
    }

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

    cache.set(key, Object.assign({fromCache: true}, result));

    return Object.assign({fromCache: false}, result);
  } catch (err) {
    error(`Could not fetch HTML content from "${url}"`);
    error(err);
    return null;
  }
};
