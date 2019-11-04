/**
 * Testing
 * @ndaidong
 */

import {readFileSync, writeFileSync} from 'fs';

import {test} from 'tap';

import extractWithReadability from '../../../src/utils/extractWithReadability.js';
import {getParserOptions} from '../../../src/config.js';

test('Testing .extractWithReadability() method', async (assert) => {
  const {env} = getParserOptions();

  const files = [
    'ghost-3-0',
    'closer-stars-pixel-4',
    'google-cloud-kubernetes',
    'beginner-blogger-mistakes',
    'golden-rule-of-freelancing',
    'cnbc-post',
  ];

  const testOne = async (file) => {
    const html = readFileSync(`./tests/data/${file}.txt`, 'utf8');
    const result = await extractWithReadability(html);
    if (env === 'gen') {
      writeFileSync(
        `./tests/data/${file}.readability.txt`,
        result,
        'utf8'
      );
    }
    const expected = readFileSync(`./tests/data/${file}.readability.txt`, 'utf8');
    assert.same(result, expected, `extractWithReadability(${file}) must be done`);
  };

  await Promise.all(files.map(testOne));

  assert.end();
});

test('Testing .extractWithReadability() method fails', async (assert) => {
  const result1 = await extractWithReadability('');
  assert.ok(!result1, 'extractWithReadability() must return null');
  const result2 = await extractWithReadability('this is not HTML data');
  assert.ok(!result2, 'extractWithReadability() must return null');
  assert.end();
});
