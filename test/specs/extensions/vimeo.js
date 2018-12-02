/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;
const {
  error,
} = require('../../../src/utils/logger');

const {
  hasProperty,
  isString,
  isObject,
  isArray,
  isNumber,
} = require('bellajs');

const {
  extract,
} = require('../../../');

const penv = process.env || {};
const ENV = penv.NODE_ENV || '';

const hasRequiredKeys = (o) => {
  let structure = [
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
    'publishedTime',
  ];

  return structure.every((k) => {
    return hasProperty(o, k);
  });
};

const URL = 'https://vimeo.com/56282283';

(() => {
  test(`Testing with .extract(${URL})`, (t) => {
    extract(URL).then((art) => {
      if (ENV !== 'citest') {
        t.comment('(Call returned result is R, so:)');
        t.ok(isObject(art), 'R must be an object.');
        t.ok(hasRequiredKeys(art), 'R must have all required keys.');
        t.ok(isString(art.alias), 'R.alias must be a string.');
        t.ok(isString(art.url), 'R.url must be a string.');
        t.ok(art.url.length > 0, 'R.url is not empty.');
        t.ok(isArray(art.canonicals), 'R.canonicals must be an array.');
        t.ok(art.canonicals.length > 0, 'R.canonicals is not empty.');
        t.ok(isString(art.title), 'R.title must be a string.');
        t.ok(art.title.length > 0, 'R.title is not empty.');
        t.ok(isString(art.description), 'R.description must be a string.');
        t.ok(isString(art.image), 'R.image must be a string.');
        t.ok(isString(art.content), 'R.content must be a string.');
        t.ok(isString(art.author), 'R.author must be a string.');
        t.ok(isString(art.source), 'R.source must be a string.');
        t.ok(isString(art.domain), 'R.domain must be a string.');
        t.ok(art.domain.length > 0, 'R.domain is not empty.');
        t.ok(isNumber(art.duration), 'R.duration must be a number.');
        t.ok(art.duration > 0, 'R.duration is greater than 0.');
        t.ok(isString(art.publishedTime), 'R.publishedTime must be a string.');
      }
      t.end();
    }).catch((e) => {
      error(e);
      t.end();
    });
  });
})();
