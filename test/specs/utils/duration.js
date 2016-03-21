/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

'use strict';

var path = require('path');
var test = require('tape');
var bella = require('bellajs');

var Chance = require('chance');
var chance = new Chance();

var rootDir = '../../../src/';
var Duration = require(path.join(rootDir, 'duration'));

var isYouTube = Duration.isYouTube;
var isVimeo = Duration.isVimeo;
var isSoundCloud = Duration.isSoundCloud;
var estimate = Duration.estimate;

var YtUrl = 'https://www.youtube.com/watch?v=klzLdzpPcQw';
test('Testing isYouTube method:', (assert) => {
  let url1 = YtUrl;
  let url2 = 'http://abc.com/xyz';
  let r1 = isYouTube(url1);
  let r2 = isYouTube(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});


var VmUrl = 'https://vimeo.com/146820026';
test('Testing isVimeo method:', (assert) => {
  let url1 = VmUrl;
  let url2 = 'http://abc.com/xyz';
  let r1 = isVimeo(url1);
  let r2 = isVimeo(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

var ScUrl = 'https://soundcloud.com/travisscott-2/wonderful-ftthe-weeknd';
test('Testing isSoundCloud method:', (assert) => {
  let url1 = ScUrl;
  let url2 = 'http://abc.com/xyz';
  let r1 = isSoundCloud(url1);
  let r2 = isSoundCloud(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

var testOne = (url) => {
  test(`Testing with ${url}`, { timeout: 15000 }, (t) => {
    estimate(url).then((d) => {
      t.ok(bella.isNumber(d), `Duration (${d}) must be a number.`);
      t.ok(d > 0, `Duration (${d}) is greater than 0.`);
      t.end();
    }).catch((e) => {
      t.end(e);
    });
  });
};

[
  YtUrl, VmUrl, ScUrl, chance.paragraph({ sentences: 10 })
].map(testOne);
