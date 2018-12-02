const fs = require('fs');

const test = require('tap').test;
const nock = require('nock');

const {
  isString,
} = require('bellajs');

const loadHTML = require('../../../src/utils/loadHTML');

const HTML = fs.readFileSync('./test/data/blogContent.txt', 'utf8');

nock('http://myblog.com')
  .get('/tech/some-alias')
  .reply(200, HTML,
    {'content-type': 'text/html'}
  );

test('Testing loadHTML method:', (assert) => {
  loadHTML('http://myblog.com/tech/some-alias').then(({html}) => {
    assert.ok(isString(html), 'It must return html content');
  }).catch((err) => {
    return err;
  }).finally(assert.end);
});

test('Testing loadHTML method from cache:', (assert) => {
  loadHTML('http://myblog.com/tech/some-alias').then(({html}) => {
    assert.ok(isString(html), 'It must return a JSON object');
  }).catch((err) => {
    return err;
  }).finally(assert.end);
});

nock('http://myblog.com/')
  .get('/tech/fail-to-load-article-1')
  .reply(400, HTML, {
    headers: {
      'content-type': 'text/html',
    },
  });

test('Testing loadHTML method fail with status:', (assert) => {
  loadHTML('http://myblog.com/tech/fail-to-load-article-1').then(({html}) => {
    return html;
  }).catch((err) => {
    let msg = 'Fetching failed for "http://myblog.com/tech/fail-to-load-article-1"';
    assert.equals(err.message, msg, 'It must return an error');
  }).finally(assert.end);
});

nock('http://myblog.com/')
  .get('/tech/fail-to-load-article-2')
  .reply(200, HTML);

test('Testing loadHTML method fail with contentType:', (assert) => {
  loadHTML('http://myblog.com/tech/fail-to-load-article-2').then(({html}) => {
    return html;
  }).catch((err) => {
    let msg = 'Error with contentType ""';
    assert.equals(err.message, msg, 'It must return an error');
  }).finally(assert.end);
});
