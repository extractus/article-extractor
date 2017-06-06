/**
 * Testing
 * @ndaidong
 */

var {
  readFileSync
} = require('fs');

var test = require('tape');

var {
  isString
} = require('bellajs');

var AP = require('../../../');

var getArticle = AP.getArticle;

var html = readFileSync('./test/fetchedData.txt', 'utf8');
var blogContent = readFileSync('./test/blogContent.txt', 'utf8');

test('Testing getArticle method:', (assert) => {
  getArticle(html).then((article) => {
    assert.ok(isString(article), 'Article must be an string.');
    assert.ok(article.length > 0, 'Article is not empty.');
    assert.end();
  });
});

test('Testing getArticle method with classes:', (assert) => {
  getArticle(blogContent).then((article) => {
    assert.ok(isString(article), 'Article must be an string.');
    assert.ok(article.length > 0, 'Article is not empty.');
    assert.end();
  });
});
