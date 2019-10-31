/**
 * Testing
 * @ndaidong
 */

import {test} from 'tap';

import isValidUrl from '../../../src/utils/isValidUrl.js';

test('Testing .isValidUrl() method', (assert) => {
  const testBadUrls = (url) => {
    const actual = isValidUrl(url);
    const expected = false;
    assert.notOk(actual, `isValidUrl('${url}') must return ${expected}`);
  };

  const badUrls = [
    '',
    5,
    {},
    [],
    'abc.com',
    'ftp://abc.com',
    'ftp://abc.com:8080',
    'ftp://abc.com/path',
  ];

  badUrls.map(testBadUrls);

  const testGoodUrls = (url) => {
    const actual = isValidUrl(url);
    const expected = true;
    assert.ok(actual, `isValidUrl('${url}') must return ${expected}`);
  };

  const goodUrls = [
    'http://abc.com:8080/path/link/article',
    'http://abc.com/path/link/article',
    'http://abc.com/path/link/article?id=123&q=p',
    'https://abc.com:8080/path/link/article',
    'https://abc.com/path/link/article',
    'https://abc.com/path/link/article?id=123&q=p',
  ];

  goodUrls.map(testGoodUrls);

  assert.end();
});
