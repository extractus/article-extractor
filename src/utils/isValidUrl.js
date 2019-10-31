// utils -> isValidUrl

import {parse} from 'url';

import {
  isString,
} from 'bellajs';

export default (url = '') => {
  if (!isString(url)) {
    return false;
  }
  const pros = ['http:', 'https:'];

  const {
    protocol,
    host,
    hostname,
  } = parse(url);

  if (!host || !hostname || !pros.includes(protocol)) {
    return false;
  }

  return true;
};
