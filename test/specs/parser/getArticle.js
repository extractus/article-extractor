/**
 * Testing
 * @ndaidong
 */

var fs = require('fs');
var test = require('tape');
var bella = require('bellajs');

var AP = require('../../../');

var getArticle = AP.getArticle;

var html = fs.readFileSync('./test/fetchedData.txt', 'utf8');

test('Testing getArticle method:', (assert) => {
  getArticle(html).then((article) => {
    assert.ok(bella.isString(article), 'Article must be an string.');
    assert.ok(article.length > 0, 'Article is not empty.');
    assert.end();
  });
});
