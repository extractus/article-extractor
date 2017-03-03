/**
 * Testing
 * @ndaidong
 */

var fs = require('fs');
var test = require('tape');
var bella = require('bellajs');
var debug = require('debug');
var error = debug('artparser:error');

var nock = require('nock');

var AP = require('../../../');
var {
  EmbedlyKey
} = AP.getConfig();

var parseWithEmbedly = AP.parseWithEmbedly;

const URL = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
const JSON = fs.readFileSync('./test/embedlyData.txt', 'utf8');

(() => {

  nock('http://api.embed.ly')
    .get(`/1/extract?key=${EmbedlyKey}&url=${encodeURIComponent(URL)}&format=json`)
    .reply(200, JSON);

  test(`Testing with .parseWithEmbedly(${URL})`, (t) => {

    parseWithEmbedly(URL).then((art) => {
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
      error(e);
      t.end(e);
    });
  });
})();


(() => {

  nock('http://api.embed.ly')
    .get(`/1/extract?key=${EmbedlyKey}&url=${encodeURIComponent(URL)}&format=json`)
    .reply(200, '');

  test(`Testing with .parseWithEmbedly(${URL})`, (t) => {
    parseWithEmbedly(URL).catch((e) => {
      error(e);
      t.ok(e instanceof Error, 'It must return an error.');
    }).finally(t.end);
  });

})();
