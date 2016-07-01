/**
 * Testing
 * @ndaidong
 */

var fs = require('fs');
var path = require('path');
var test = require('tape');
var bella = require('bellajs');

var rootDir = '../../../src/';
var AP = require(path.join(rootDir, 'article-parser'));

var getArticle = AP.getArticle;

var html = fs.readFileSync('./test/fetchedData.txt', 'utf8');

test('Testing parseMeta method:', (assert) => {
  getArticle(html).then((article) => {
    assert.ok(bella.isString(article), 'Article must be an string.');
    assert.ok(article.length > 0, 'Article is not empty.');
    assert.end();
  });
});
