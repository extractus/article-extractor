/**
 * Testing
 * @ndaidong
 */

import {readFileSync, writeFileSync} from 'fs';

import {test} from 'tap';

import extractMetaData from '../../../src/utils/extractMetaData.js';
import {getParserOptions} from '../../../src/config.js';

test('Testing .extractMetaData() method', (assert) => {
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
    const result = extractMetaData(html);
    if (env === 'gen') {
      writeFileSync(
        `./tests/data/${file}.meta.json`,
        JSON.stringify(result, null, '  '),
        'utf8'
      );
    }
    const expected = JSON.parse(
      readFileSync(`./tests/data/${file}.meta.json`, 'utf8')
    );
    assert.same(result, expected, `extractMetaData(${file}) must be done`);
  };

  files.map(testOne);

  assert.end();
});
