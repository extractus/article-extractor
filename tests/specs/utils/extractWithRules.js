/**
 * Testing
 * @ndaidong
 */

import {readFileSync, writeFileSync} from 'fs';

import {test} from 'tap';

import extractWithRules from '../../../src/utils/extractWithRules.js';
import {getParserOptions} from '../../../src/config.js';

test('Testing .extractWithRules() method', (assert) => {
  const {env} = getParserOptions();

  const files = [
    'ghost-3-0',
    'closer-stars-pixel-4',
    'google-cloud-kubernetes',
    'beginner-blogger-mistakes',
    'golden-rule-of-freelancing',
    'cnbc-post',
  ];

  const testOne = (file) => {
    const html = readFileSync(`./tests/data/${file}.txt`, 'utf8');
    const result = extractWithRules(html);
    if (env === 'gen') {
      writeFileSync(`./tests/data/${file}.rules.txt`, result, 'utf8');
    }
    const expected = readFileSync(`./tests/data/${file}.rules.txt`, 'utf8');
    assert.same(result, expected, `extractWithRules(${file}) must be done`);
  };

  files.map(testOne);

  assert.end();
});
