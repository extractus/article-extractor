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

var extract = AP.extract;
var parseWithEmbedly = AP.parseWithEmbedly;

var samples = [
  'http://www.onextrapixel.com/2015/12/02/why-and-how-to-liven-up-your-site-animation-in-web-design/',
  'http://www.smashingapps.com/2015/12/01/8-free-productivity-tools-for-business-owners.html',
  'http://www.ted.com/talks/tony_robbins_asks_why_we_do_what_we_do',
  'https://soundcloud.com/wlrn/1104am-local-government-opposed-to-bill-that-would-streamline-elections-1',
  'https://www.youtube.com/watch?v=CTjB-eK4XF8',
  'https://vimeo.com/146753785',
  'http://codecondo.com/5-steps-learn-rock-twitter/',
  'https://googleblog.blogspot.com/2015/12/join-googleorg-to-help-make-education.html',
  'http://www.sfgate.com/news/crime/article/At-least-18-killed-in-snowstorm-related-deaths-6780430.php',
  'http://www.nytimes.com/2016/01/25/world/middleeast/egypt-museum-king-tutankhamen-mask.html',
  'http://www.cbssports.com/nfl/writer/pete-prisco/25461111/super-bowl-2016-broncos-panthers-ride-dominating-defenses-to-title-game'
];

var hasRequiredKeys = (o) => {
  var structure = [
    'alias',
    'url',
    'canonicals',
    'title',
    'description',
    'image',
    'content',
    'author',
    'source',
    'domain',
    'duration'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

var testOne = (url) => {

  test(`Testing with .extract(${url})`, { timeout: 15000 }, (t) => {

    extract(url).then((art) => {
      t.comment('(Call returned result is R, so:)');
      t.ok(bella.isObject(art), 'R must be an object.');
      t.ok(hasRequiredKeys(art), 'R must have all required keys.');
      t.ok(bella.isString(art.alias), 'R.alias must be a string.');
      t.ok(bella.isString(art.url), 'R.url must be a string.');
      t.ok(art.url.length > 0, 'R.url is not empty.');
      t.ok(bella.isArray(art.canonicals), 'R.canonicals must be an array.');
      t.ok(art.canonicals.length > 0, 'R.canonicals is not empty.');
      t.ok(bella.isString(art.title), 'R.title must be a string.');
      t.ok(art.title.length > 0, 'R.title is not empty.');
      t.ok(bella.isString(art.description), 'R.description must be a string.');
      t.ok(bella.isString(art.image), 'R.image must be a string.');
      t.ok(bella.isString(art.content), 'R.content must be a string.');
      t.ok(bella.isString(art.author), 'R.author must be a string.');
      t.ok(bella.isString(art.source), 'R.source must be a string.');
      t.ok(bella.isString(art.domain), 'R.domain must be a string.');
      t.ok(art.domain.length > 0, 'R.domain is not empty.');
      t.ok(bella.isNumber(art.duration), 'R.duration must be a number.');
      t.ok(art.duration > 0, 'R.duration is greater than 0.');
      t.end();
    }).catch((e) => {
      t.end(e);
    });
  });

};

samples.map(testOne);

var testEmbedly = () => {
  var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  test(`Testing with .parseWithEmbedly(${url})`, { timeout: 15000 }, (t) => {

    parseWithEmbedly(url).then((art) => {
      t.comment('(Call returned result is R, so:)');
      t.ok(bella.isObject(art), 'R must be an object.');
      t.ok(bella.isString(art.url), 'R.url must be a string.');
      t.ok(art.url.length > 0, 'R.url is not empty.');
      t.ok(bella.isString(art.title), 'R.title must be a string.');
      t.ok(art.title.length > 0, 'R.title is not empty.');
      t.ok(bella.isString(art.description), 'R.description must be a string.');
      t.ok(bella.isString(art.image), 'R.image must be a string.');
      t.ok(bella.isString(art.content), 'R.content must be a string.');
      t.ok(bella.isString(art.author), 'R.author must be a string.');
      t.ok(bella.isString(art.source), 'R.source must be a string.');
      t.end();
    }).catch((e) => {
      t.end(e);
    });
  });
};

testEmbedly();
