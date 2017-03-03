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

var {
  extract
} = require('../../../');

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
    'duration',
    'publishedTime'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

const URL = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
const HTML = fs.readFileSync('./test/fetchedData.txt', 'utf8');

(() => {

  let url = `https://medium.com/well-retrieve-article`;
  nock('https://medium.com')
    .get('/well-retrieve-article')
    .reply(200, HTML);

  test(`Testing with .extract(${url})`, {timeout: 5000}, (t) => {

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
      t.ok(bella.isString(art.publishedTime), 'R.publishedTime must be a string.');
      t.end();
    }).catch((e) => {
      error(e);
      t.end();
    });
  });

})();

(() => {

  nock('https://medium.com')
    .get('/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6')
    .reply(200, '');

  test(`Testing with .extract(${URL})`, {timeout: 5000}, (t) => {
    extract(URL).catch((e) => {
      let msg = 'Cannot read property \'startsWith\' of null';
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });

})();

(() => {

  nock('https://medium.com')
    .get('/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6')
    .reply(200, 'SOMETHING NO HTML<html><b>ASD<</html>');

  test(`Testing with .extract(${URL})`, {timeout: 5000}, (t) => {
    extract(URL).catch((e) => {
      let msg = 'Cannot read property \'startsWith\' of null';
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });

})();
