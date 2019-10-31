// utils -> isValidURL

import fetch from 'node-fetch';

import {error} from './logger';
import {getNodeFetchOptions} from '../config';

export default async (url = '') => {
  try {
    const opts = getNodeFetchOptions();
    opts.method = 'HEAD';
    const res = await fetch(url, opts);
    return res.status === 200;
  } catch (err) {
    error(err);
    return false;
  }
};
