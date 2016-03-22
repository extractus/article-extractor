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

var rootDir = '../../../src/';
var AP = require(path.join(rootDir, 'article-parser'));

var sample = {
  wordsPerMinute: 500,
  blackList: [ 'bing.com', 'yahoo.com' ],
  exceptDomain: [ 'google.com', 'apple.com' ],
  adsDomain: [ 'twitter.com', 'facebook.com' ],
  SoundCloudKey: 'SOUNDCLOUDKEY',
  YouTubeKey: 'YOUTUBEKEY',
  EmbedlyKey: 'EMBEDLYKEY',
  ReadabilityToken: 'READABILITYTOKEN',
  htmlRules: {
    allowedTags: [
      'html', 'body', 'meta', 'link', 'title'
    ],
    allowedAttributes: {
      'a': [ 'href' ]
    }
  }
};

var hasRequiredKeys = (o) => {
  var structure = [
    'wordsPerMinute',
    'blackList',
    'exceptDomain',
    'adsDomain',
    'SoundCloudKey',
    'YouTubeKey',
    'EmbedlyKey',
    'ReadabilityToken',
    'htmlRules'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

var fake = Object.create(AP);

test('Testing "configure" method:', (assert) => {

  fake.configure(sample);
  let config = fake.getConfig();

  assert.comment('(Call config object is C, so:)');
  assert.ok(bella.isObject(config), 'C must be an object.');
  assert.ok(hasRequiredKeys(config), 'C must have all required keys.');

  let a1 = config.SoundCloudKey;
  let e1 = sample.SoundCloudKey;
  assert.deepEqual(a1, e1, `C.SoundCloudKey must be ${e1}`);

  let a2 = config.YouTubeKey;
  let e2 = sample.YouTubeKey;
  assert.deepEqual(a2, e2, `C.YouTubeKey must be ${e2}`);

  let a3 = config.EmbedlyKey;
  let e3 = sample.EmbedlyKey;
  assert.deepEqual(a3, e3, `C.EmbedlyKey must be ${e3}`);

  let a4 = config.ReadabilityToken;
  let e4 = sample.ReadabilityToken;
  assert.deepEqual(a4, e4, `C.ReadabilityToken must be ${e4}`);

  let a5 = config.htmlRules;
  let e5 = sample.htmlRules;
  assert.deepEqual(a5, e5, 'C.htmlRules must be equal to sample.htmlRules');

  assert.deepEqual(config.wordsPerMinute, sample.wordsPerMinute, `C.wordsPerMinute must be ${sample.wordsPerMinute}`);

  assert.end();
});
