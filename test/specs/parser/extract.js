/**
 * Testing
 * @ndaidong
 */

var path = require('path');
var test = require('tape');
var sinon = require('sinon');
var bella = require('bellajs');

var rootDir = '../../../src/';
var AP = require(path.join(rootDir, 'article-parser'));

var extract = AP.extract;
// var parseWithEmbedly = AP.parseWithEmbedly;

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

sinon.test(() => {

  let url = 'http://sample-article.com/abcdef';

  var server = sinon.fakeServer.create();

  server.respondWith(
    'GET',
    `${url}`,
    [
      200, {
        'Content-Type': 'application/json'
      },
      '{ "stuff": "is", "awesome": "in here" }'
    ]
  );

  test(`Testing with .extract(${url})`, {timeout: 15000}, (t) => {

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

});


/*
var testEmbedly = () => {
  var url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  test(`Testing with .parseWithEmbedly(${url})`, {timeout: 15000}, (t) => {

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
*/
