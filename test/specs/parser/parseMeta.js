/**
 * Testing
 * @ndaidong
 */

var fs = require('fs');
var test = require('tape');
var bella = require('bellajs');

var AP = require('../../../');

var parseMeta = AP.parseMeta;

var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
var html = fs.readFileSync('./test/fetchedData.txt', 'utf8');

var hasRequiredKeys = (o) => {
  let structure = [
    'source',
    'url',
    'title',
    'description',
    'image',
    'author',
    'publishedTime'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

test('Testing parseMeta method:', (assert) => {
  let data = parseMeta(html, url);
  assert.ok(bella.isObject(data), 'Metadata must be an object.');
  assert.ok(hasRequiredKeys(data), 'Metadata must have all required keys.');
  assert.end();
});
