/**
 * Testing
 * @ndaidong
 */

import {readFileSync, writeFileSync} from 'fs';

import {test} from 'tap';
import nock from 'nock';

import {md5} from 'bellajs';

import parseOEmbed from '../../../src/utils/parseOEmbed.js';
import {getParserOptions} from '../../../src/config.js';

test('Testing .parseOEmbed() method', async (assert) => {
  const {env} = getParserOptions();

  const urls = [
    'https://www.youtube.com/watch?v=lexE3NR0n34',
    'https://twitter.com/ndaidong/status/1173592062878314497',
  ];

  nock('https://www.youtube.com').get(
    '/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DlexE3NR0n34'
  ).reply(
    200,
    readFileSync(`./tests/data/oembed-origin-${md5(urls[0])}.txt`),
    {
      'Content-Type': 'application/json',
    }
  );

  nock('https://publish.twitter.com').get(
    '/oembed?format=json&url=https%3A%2F%2Ftwitter.com%2Fndaidong%2Fstatus%2F1173592062878314497'
  ).reply(
    200,
    readFileSync(`./tests/data/oembed-origin-${md5(urls[1])}.txt`),
    {
      'Content-Type': 'application/json',
    }
  );

  const testOne = async (url) => {
    const hash = md5(url);
    const result = await parseOEmbed(url);
    if (env === 'gen') {
      writeFileSync(
        `./tests/data/oembed-parser-${hash}.json`,
        JSON.stringify(result, null, '  '),
        'utf8'
      );
    }
    const expected = readFileSync(`./tests/data/oembed-parser-${hash}.json`, 'utf8');
    assert.same(result, JSON.parse(expected), `parseOEmbed(${url}) must be done`);
  };

  await Promise.all(urls.map(testOne));

  nock.cleanAll();
  assert.end();
});
