// utils -> absolutifyUrl

import {parse, resolve} from 'url';

import {isString} from 'bellajs';

import isValidUrl from './isValidUrl';

export default (fullUrl, relativeUrl) => {
  if (!isValidUrl(fullUrl) || !isString(relativeUrl)) {
    return '';
  }
  const parsed = parse(fullUrl);
  const first = [parsed.protocol, parsed.host].join('//');
  return resolve(first, relativeUrl);
};
