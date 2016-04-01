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

var getOEmbed = AP.getOEmbed;

var samples = [
  'https://www.youtube.com/watch?v=CTjB-eK4XF8',
  'https://vimeo.com/146820026',
  'https://soundcloud.com/travisscott-2/wonderful-ftthe-weeknd'
];

var hasRequiredKeys = (o) => {
  var structure = [
    'type',
    'thumbnail_url',
    'provider_name',
    'title'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

var testOne = (url) => {

  test(`Testing with .getOEmbed(${url})`, { timeout: 15000 }, (t) => {

    getOEmbed(url).then((oem) => {
      t.comment('(Call returned result is R, so:)');
      t.ok(bella.isObject(oem), 'R must be an object.');
      t.ok(hasRequiredKeys(oem), 'R must have all required keys.');
      t.ok(bella.isString(oem.thumbnail_url), 'R.thumbnail_url must be a string.');
      t.ok(oem.thumbnail_url.length > 0, 'R.thumbnail_url is not empty.');
      t.ok(bella.isString(oem.provider_name), 'R.provider_name must be a string.');
      t.ok(oem.provider_name.length > 0, 'R.provider_name is not empty.');
      t.ok(bella.isString(oem.title), 'R.title must be a string.');
      t.ok(oem.title.length > 0, 'R.title is not empty.');
      t.end();
    }).catch((e) => {
      t.end(e);
    });
  });

};

samples.map(testOne);
