// retrieve.test

const {parse} = require('url');

const nock = require('nock');

const retrieve = require('./retrieve');

const parseUrl = (url) => {
  const re = parse(url);
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.path,
  };
};


test(`test retrieve from bad source`, async () => {
  const url = 'http://some.where/article/abc-xyz';
  const {baseUrl, path} = parseUrl(url);
  nock(baseUrl).head(path).reply(200);
  nock(baseUrl).get(path).reply(200, '', {
    'Content-Type': 'something/strange',
  });
  const result = await retrieve(url);
  expect(result).toBe(null);
});
