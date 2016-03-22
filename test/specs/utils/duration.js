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
var isAudioBoom = Duration.isAudioBoom;

var estimateMovie = Duration.estimateMovie;
var estimateAudio = Duration.estimateAudio;
var estimate = Duration.estimate;

var getYtid = Duration.getYtid;
var toSecond = Duration.toSecond;

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

var AbUrl = 'https://audioboom.com/boos/4314271-s02-episode-10-thorny-politics';
test('Testing isAudioBoom method:', (assert) => {
  let url1 = AbUrl;
  let url2 = 'http://abc.com/xyz';
  let r1 = isAudioBoom(url1);
  let r2 = isAudioBoom(url2);
  let e1 = true, e2 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.end();
});

var eachURL = (url) => {
  test(`Testing estimate(${url})`, { timeout: 15000 }, (t) => {
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
].map(eachURL);

var eachYouTubeMovies = (url) => {
  test(`Testing  getYtid(${url})`, (t) => {
    let id = getYtid(url);
    let exp = 'klzLdzpPcQw';
    t.ok(id, `Video ID must be '${exp}'.`);
    t.end();
  });
};

[
  YtUrl, 'https://youtu.be/klzLdzpPcQw', 'https://www.youtube.com/embed/klzLdzpPcQw', 'https://www.youtube.com/v/klzLdzpPcQw'
].map(eachYouTubeMovies);


var testFailEstimateAudio = () => {
  let url = 'http://abc.com/xyz';
  test(`Testing estimateAudio(${url})`, (t) => {
    estimateAudio(url).then((re) => {
      t.fail('It should fail here!');
      return re;
    }).catch((er) => {
      t.pass(er);
    }).finally(t.end);
  });
};

testFailEstimateAudio();

var testFailEstimateMovie = () => {
  let url = 'http://abc.com/xyz';
  test(`Testing estimateMovie(${url})`, (t) => {
    estimateMovie(url).then((re) => {
      t.fail('It should fail here!');
      return re;
    }).catch((er) => {
      t.pass(er);
    }).finally(t.end);
  });
};

testFailEstimateMovie();

var convertOne = (item) => {
  let dur = item.duration;
  let exp = item.second;
  test(`Testing  toSecond(${dur})`, { timeout: 15000 }, (t) => {
    let act = toSecond(dur);
    t.equal(act, exp, `Result for '${dur}' must be '${exp}'.`);
    t.end();
  });
};

[
  {
    duration: 'PT53M38S',
    second: 3218
  },
  {
    duration: 'PT4M34S',
    second: 274
  },
  {
    duration: 'PT1H32S',
    second: 3632
  },
  {
    duration: 'PT1H21M50S',
    second: 4910
  },
  {
    duration: 'PT2M2S',
    second: 122
  }
].map(convertOne);
