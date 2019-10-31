// utils/extractWithReadability

import {extract} from 'oembed-parser';

import {
  error,
} from '../utils/logger';

export default async (url) => {
  try {
    const oembed = await extract(url);
    return oembed;
  } catch (err) {
    error(err);
    return null;
  }
};
