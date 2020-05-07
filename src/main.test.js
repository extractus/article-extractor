// main.test

const {readFileSync} = require('fs');
const {parse} = require('url');

const nock = require('nock');

const {
  extract,
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
  nock(baseUrl).head(path).reply(200, '');
  nock(baseUrl).get(path).reply(404, 'Content not found', {
    'Content-Type': 'text/html',
  });
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
  const result = await extract(url);
  expect(result).toBeInstanceOf(Object);
  keys.forEach((k) => {
    expect(hasProperty(result, k)).toBe(true);
  });
});
