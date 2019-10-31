/**
 * Testing
 * @ndaidong
 */

import {test} from 'tap';

import normalizeUrl from '../../../src/utils/normalizeUrl.js';

test('Testing .normalizeUrl() method', (assert) => {
  const testOne = ({url, expected}) => {
    const actual = normalizeUrl(url);
    assert.equal(actual, expected, `normalizeUrl('${url}') must return ${expected}`);
  };

  const entries = [
    {
      url: 'http://some.where/article/abc-xyz',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz#name,bob',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz?q=3',
    },
    {
      url: 'http://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz',
    },
    {
      url: 'http://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'http://some.where/article/abc-xyz?q=3',
    },
  ];

  entries.map(testOne);

  assert.end();
});
