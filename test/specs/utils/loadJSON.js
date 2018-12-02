const test = require('tap').test;
const nock = require('nock');

const {
  isObject,
} = require('bellajs');

const loadJSON = require('../../../src/utils/loadJSON');

const JSON = require('../../data/geoip');

nock('http://freegeoip.net')
  .get('/json/github.com')
  .reply(200, JSON);

test('Testing loadJSON method:', (assert) => {
  loadJSON('http://freegeoip.net/json/github.com').then(({json}) => {
    assert.ok(isObject(json), 'It must return a JSON object');
  }).catch((err) => {
    return err;
  }).finally(assert.end);
});

test('Testing loadJSON from cache:', (assert) => {
  loadJSON('http://freegeoip.net/json/github.com').then(({json}) => {
    assert.ok(isObject(json), 'It must return a JSON object');
  }).catch((err) => {
    return err;
  }).finally(assert.end);
});

nock('http://freegeoip.net')
  .get('/json/abc.com')
  .reply(400, JSON);

test('Testing loadJSON method fail with status:', (assert) => {
  loadJSON('http://freegeoip.net/json/abc.com').then(({json}) => {
    return json;
  }).catch((err) => {
    let msg = 'Fetching failed for http://freegeoip.net/json/abc.com';
    assert.equals(err.message, msg, 'It must return an error');
  }).finally(assert.end);
});

nock('http://freegeoip.net')
  .get('/json/xyz.com')
  .reply(200, '');

test('Testing loadJSON method fail with JSON format:', (assert) => {
  loadJSON('http://freegeoip.net/json/xyz.com').then(({json}) => {
    return json;
  }).catch((err) => {
    let msg = 'Error while fetching remote JSON from "http://freegeoip.net/json/xyz.com"';
    assert.equals(err.message, msg, 'It must return an error');
  }).finally(assert.end);
});
