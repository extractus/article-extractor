/**
 * Testing
 * @ndaidong
 */

import {test} from 'tap';

import absolutifyUrl from '../../../src/utils/absolutifyUrl.js';

test('Testing .absolutifyUrl() method', (assert) => {
  const testOne = ({fullUrl, relativeUrl, expected}) => {
    const actual = absolutifyUrl(fullUrl, relativeUrl);
    assert.equal(actual, expected, `absolutifyUrl('${fullUrl}', '${relativeUrl}') must return ${expected}`);
  };

  const entries = [
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: '/assets/images/ok.png',
      expected: 'http://some.where/assets/images/ok.png',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: '../images/ok.png',
      expected: 'http://some.where/images/ok.png',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: '../../ok.png',
      expected: 'http://some.where/ok.png',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: '../../../../images/ok.png',
      expected: 'http://some.where/images/ok.png',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: 'http://some.where/assets/images/ok.png',
      expected: 'http://some.where/assets/images/ok.png',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: 'http://here.is/assets/images/ok.png',
      expected: 'http://here.is/assets/images/ok.png',
    },
    {
      fullUrl: 'https://eslint.org/blog/2019/01/future-typescript-eslint',
      relativeUrl: '/assets/img/favicon.512x512.png',
      expected: 'https://eslint.org/assets/img/favicon.512x512.png',
    },
    {
      fullUrl: '/article/abc-xyz',
      relativeUrl: '/assets/images/ok.png',
      expected: '',
    },
    {
      fullUrl: 'abcxyz1902',
      relativeUrl: '/assets/images/ok.png',
      expected: '',
    },
    {
      fullUrl: 'http://some.where/article/abc-xyz',
      relativeUrl: 1866,
      expected: '',
    },
  ];

  entries.map(testOne);

  assert.end();
});
