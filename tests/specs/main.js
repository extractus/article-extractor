/**
 * Testing
 * @ndaidong
 */

import {readFileSync, writeFileSync} from 'fs';

import nock from 'nock';
import {test} from 'tap';

import {
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  extract,
} from '../../src/main';

import {
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
} from '../../src/config.js';

import {name, version} from '../../package.json';


const hasProps = (obj, props) => {
  return props.every((prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  });
};

test('Testing .extract() method (using mocking data)', async (assert) => {
  const {env} = getParserOptions();

  const baseUrl = 'https://some.where';

  const samples = [
    {
      path: '/blog/ghost-3-0',
      fname: 'ghost-3-0',
    },
    {
      path: '/tech/closer-stars-pixel-4',
      fname: 'closer-stars-pixel-4',
    },
    {
      path: '/intro/google-cloud-kubernetes',
      fname: 'google-cloud-kubernetes',
    },
    {
      path: '/guid/start-blogging',
      fname: 'beginner-blogger-mistakes',
    },
    {
      path: '/rules/golden/freelancing',
      fname: 'golden-rule-of-freelancing',
    },
    {
      path: '/news/29881/cool-thing-here',
      fname: 'cnbc-post',
    },
  ];

  const testOne = async ({path, fname}) => {
    const html = readFileSync(`./tests/data/${fname}.txt`, 'utf8');
    nock(baseUrl).head(path).reply(200, '');
    nock(baseUrl).get(path).reply(200, html, {
      'Content-Type': 'text/html',
    });
    const url = baseUrl + path;
    const result = await extract(url);
    if (env === 'gen') {
      writeFileSync(
        `./tests/data/${fname}.article.txt`,
        JSON.stringify(result, null, '  '),
        'utf8'
      );
    }
    const expected = readFileSync(`./tests/data/${fname}.article.txt`, 'utf8');
    assert.same(
      result,
      JSON.parse(expected),
      `extract(${url}) must be done`
    );
  };

  await Promise.all(samples.map(testOne));

  nock.cleanAll();
  assert.end();
});


test('Testing .extract() method (live data)', async (assert) => {
  const urls = [
    'https://medium.com/@ndaidong/setup-a-simple-environment-for-deep-learning-dc05c81c4914',
    'https://www.youtube.com/watch?v=lexE3NR0n34',
    'https://kipalog.com/posts/Functional-Programming---Phan-1---Con-duong-sang',
  ];

  const props = [
    'url', 'title', 'author',
    'description', 'content', 'image',
    'published', 'links', 'ttr',
  ];

  const testOne = async (url) => {
    const article = await extract(url);
    assert.type(article, 'object', 'Article must be an object');
    assert.ok(
      hasProps(article, props),
      'Article must have all required properties'
    );
    assert.ok(
      article.url !== '',
      'Article `url` must be not empty'
    );
    assert.ok(
      article.title !== '',
      'Article `title` must be not empty'
    );
    assert.ok(
      article.content !== '',
      'Article `content` must be not empty'
    );
    assert.ok(
      article.image !== '',
      'Article `image` must be not empty'
    );
    assert.ok(
      article.links.length > 0,
      'Article `links` must be not empty'
    );
  };

  await Promise.all(urls.map(testOne));

  assert.end();
});


test('Testing .extract() method (using preload HTML)', async (assert) => {
  const {env} = getParserOptions();
  const samples = [
    'ghost-3-0',
    'closer-stars-pixel-4',
    'google-cloud-kubernetes',
    'beginner-blogger-mistakes',
    'golden-rule-of-freelancing',
    'cnbc-post',
  ];

  const testOne = async (fname) => {
    const html = readFileSync(`./tests/data/${fname}.txt`, 'utf8');
    const result = await extract(html);
    if (env === 'gen') {
      writeFileSync(
        `./tests/data/${fname}.article-preload.txt`,
        JSON.stringify(result, null, '  '),
        'utf8'
      );
    }
    const expected = readFileSync(
      `./tests/data/${fname}.article-preload.txt`,
      'utf8'
    );
    assert.same(
      result,
      JSON.parse(expected),
      `extract(${fname}) must be done`
    );
  };

  await Promise.all(samples.map(testOne));

  nock.cleanAll();
  assert.end();
});


test('Testing setParserOptions/getParserOptions methods', (assert) => {
  const expectedWPM = 400;

  setParserOptions({
    wordsPerMinute: expectedWPM,
  });

  const actual = getParserOptions();

  assert.same(
    actual.wordsPerMinute,
    expectedWPM,
    'setParserOptions() must work correctly'
  );

  const expectedAlgorithm = 'levenshtein';
  assert.same(
    actual.urlsCompareAlgorithm,
    expectedAlgorithm,
    'getParserOptions() must work correctly'
  );

  assert.end();
});

test('Testing setNodeFetchOptions/getNodeFetchOptions methods', (assert) => {
  setNodeFetchOptions({
    headers: {
      authorization: 'bearer <token>',
    },
    timeout: 20,
    somethingElse: 1000,
  });

  const actual = getNodeFetchOptions();
  const actualHeader = actual.headers;
  const expectedHeader = {
    'authorization': 'bearer <token>',
    'user-agent': `${name}/${version}`,
  };
  assert.same(
    actualHeader,
    expectedHeader,
    'setNodeFetchOptions() must work correctly'
  );
  assert.same(
    actual.timeout,
    20,
    'getNodeFetchOptions() must work correctly'
  );

  assert.end();
});


test('Testing setSanitizeHtmlOptions/getSanitizeHtmlOptions methods', (assert) => {
  setSanitizeHtmlOptions({
    allowedTags: ['div', 'span'],
    allowedAttributes: {
      a: ['href', 'title'],
    },
  });

  const actual = getSanitizeHtmlOptions();
  const actualAllowedAttributes = actual.allowedAttributes;
  const expectedAllowedAttributes = {
    a: ['href', 'title'],
    img: ['src', 'alt'],
  };
  assert.same(
    actualAllowedAttributes,
    expectedAllowedAttributes,
    'setSanitizeHtmlOptions() must work correctly'
  );
  const actualAllowedTags = actual.allowedTags;
  const expectedAllowedTags = ['div', 'span'];
  assert.same(
    actualAllowedTags,
    expectedAllowedTags,
    'getSanitizeHtmlOptions() must work correctly'
  );

  assert.end();
});
