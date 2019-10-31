/**
 * Testing
 * @ndaidong
 */

import {readFileSync} from 'fs';

import {test} from 'tap';

import isHtmlDoc from '../../../src/utils/isHtmlDoc.js';

test('Testing .extractMetaData() method', (assert) => {
  const files = [
    'ghost-3-0',
    'closer-stars-pixel-4',
    'google-cloud-kubernetes',
    'beginner-blogger-mistakes',
    'golden-rule-of-freelancing',
    'cnbc-post',
  ];

  const textes = files.map((fname) => {
    return readFileSync(`./tests/data/${fname}.txt`, 'utf8');
  });

  const samples = textes.map((html) => {
    return {
      html,
      expected: true,
    };
  });

  samples.concat([
    {
      html: '',
      expected: false,
    },
    {
      html: 1234,
      expected: false,
    },
    {
      html: 'This is a sentence',
      expected: false,
    },
  ]);

  const testOne = ({html, expected}) => {
    const actual = isHtmlDoc(html);
    assert.equal(actual, expected, `isHtmlDoc() must work correctly`);
  };

  samples.map(testOne);

  assert.end();
});
