// main.test

const {readFileSync} = require('fs');
const {parse} = require('url');

const nock = require('nock');

const {name, version} = require('../package.json');

const {
  extract,
  setParserOptions,
  setNodeFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getNodeFetchOptions,
  getSanitizeHtmlOptions,
} = require('./main');


const keys = 'url title description image author content published source links ttr'.split(' ');


const parseUrl = (url) => {
  const re = parse(url);
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.path,
  };
};

const hasProperty = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

test(`test extract a non-string link`, async () => {
  const url = [];
  const fn = async () => {
    const re = await extract(url);
    return re;
  };
  expect(fn()).rejects.toThrow(Error);
});

test(`test extract a bad link`, async () => {
  const url = 'sfh poidfsf sakdjfh';
  const re = await extract(url);
  expect(re).toBe(null);
});

test(`test extract a fake link`, async () => {
  const url = 'http://somewhere.xyz';
  const {baseUrl, path} = parseUrl(url);
  nock(baseUrl).head(path).reply(404);
  nock(baseUrl).get(path).reply(404);
  const fn = async () => {
    const re = await extract(url);
    return re;
  };
  expect(fn()).rejects.toThrow(Error);
});

test(`test extract an error endpoint`, async () => {
  const url = 'http://bad-endpoint-somewhere-do-not.exist';
  const fn = async () => {
    const re = await extract(url);
    return re;
  };
  expect(fn()).rejects.toThrow(Error);
});

test(`test extract a good link`, async () => {
  const url = 'https://medium.com/swlh/the-golden-rule-of-freelancing-d02a35c73baa';
  const html = readFileSync('./test-data/golden-rule-of-freelancing.txt', 'utf8');
  const {baseUrl, path} = parseUrl(url);
  nock(baseUrl).head(path).reply(200, '');
  nock(baseUrl).get(path).reply(200, html, {
    'Content-Type': 'text/html',
  });
  const result = await extract(url);
  expect(result).toBeInstanceOf(Object);
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true);
  });
});

test(`test extract from html content`, async () => {
  const html = readFileSync('./test-data/venturebeat.txt', 'utf8');
  const result = await extract(html);
  expect(result).toBeInstanceOf(Object);
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true);
  });
});

test(`test extract from actual html content`, async () => {
  const html = readFileSync('./test-data/regular-article.html', 'utf8');
  const result = await extract(html);
  expect(result).toBeInstanceOf(Object);
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true);
  });
});

test(`test extract oembed`, async () => {
  const link = 'https://twitter.com/ndaidong/status/1173592062878314497';
  const url = 'https://publish.twitter.com/oembed?format=json&url=' + encodeURIComponent(link);
  const text = readFileSync('./test-data/tweet-oembed.json', 'utf8');
  const json = JSON.parse(text);
  const {baseUrl, path} = parseUrl(url);
  nock(baseUrl).head(path).reply(200, '');
  nock(baseUrl).get(path).reply(200, json, {
    'Content-Type': 'application/json',
  });
  const result = await extract(link);
  expect(result).toBeInstanceOf(Object);
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true);
  });
});


test('Testing setParserOptions/getParserOptions methods', () => {
  const expectedWPM = 400;
  const expectedAlgorithm = 'levenshtein';

  setParserOptions({
    wordsPerMinute: expectedWPM,
  });

  const actual = getParserOptions();

  expect(actual.wordsPerMinute).toEqual(expectedWPM);
  expect(actual.urlsCompareAlgorithm).toEqual(expectedAlgorithm);
});


test('Testing setNodeFetchOptions/getNodeFetchOptions methods', () => {
  setNodeFetchOptions({
    headers: {
      authorization: 'bearer <token>',
    },
    timeout: 20,
    somethingElse: 1000,
  });

  const actual = getNodeFetchOptions();
  const expectedHeader = {
    'authorization': 'bearer <token>',
    'user-agent': `${name}/${version}`,
  };

  expect(actual.headers).toEqual(expectedHeader);
  expect(actual.timeout).toEqual(20);
});


test('Testing with custom user agent string', () => {
  const myUserAgent = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
  setNodeFetchOptions({
    headers: {
      'authorization': 'bearer <token>',
      'user-agent': myUserAgent,
    },
    timeout: 20,
    somethingElse: 1000,
  });

  const actual = getNodeFetchOptions();
  const expectedHeader = {
    'authorization': 'bearer <token>',
    'user-agent': myUserAgent,
  };

  expect(actual.headers).toEqual(expectedHeader);
  expect(actual.timeout).toEqual(20);
});

test('Testing setSanitizeHtmlOptions/getSanitizeHtmlOptions methods', () => {
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

  expect(actualAllowedAttributes).toEqual(expectedAllowedAttributes);

  const actualAllowedTags = actual.allowedTags;
  const expectedAllowedTags = ['div', 'span'];
  expect(actualAllowedTags).toEqual(expectedAllowedTags);

  setSanitizeHtmlOptions({
    allowedTags: [],
  });

  expect(getSanitizeHtmlOptions().allowedTags).toEqual([]);
});
