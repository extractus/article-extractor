/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');
var bella = require('bellajs');

var rootDir = '../../../src/';
var AP = require(path.join(rootDir, 'article-parser'));

var parseMeta = AP.parseMeta;

var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
var html = fs.readFileSync('./test/fetchedData.txt', 'utf8');

var hasRequiredKeys = (o) => {
  var structure = [
    'source',
    'url',
    'title',
    'description',
    'image',
    'author'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

test('Testing parseMeta method:', (assert) => {
  let data = parseMeta(html, url);
  assert.comment('(Call returned result is R, so:)');
  assert.ok(bella.isObject(data), 'R must be an object.');
  assert.ok(hasRequiredKeys(data), 'R must have all required keys.');
  assert.end();
});
