/**
 * Testing
 * @ndaidong
 */

import {readFileSync} from 'fs';

import {test} from 'tap';

import getTimeToRead from '../../../src/utils/getTimeToRead.js';

test('Testing .getTimeToRead() method', (assert) => {
  const article01 = readFileSync('./tests/data/random-article-01.txt', 'utf8');
  const article02 = readFileSync('./tests/data/random-article-02.txt', 'utf8');

  const actual01 = getTimeToRead(article01);
  const expected01 = 63;
  assert.equal(actual01, expected01, `getTimeToRead($article01) must return ${expected01}`);

  const actual02 = getTimeToRead(article02);
  const expected02 = 133;
  assert.equal(actual02, expected02, `getTimeToRead($article02) must return ${expected02}`);

  assert.end();
});
