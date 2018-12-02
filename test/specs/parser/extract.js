/**
 * Testing
 * @ndaidong
 */

const fs = require('fs');
const test = require('tap').test;
const {
  error,
} = require('../../../src/utils/logger');

const nock = require('nock');

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

const URL = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
const HTML = fs.readFileSync('./test/data/fetchedData.txt', 'utf8');

(() => {
  let url = `https://medium.com/well-retrieve-article`;
  nock('https://medium.com')
    .defaultReplyHeaders({
      'Content-Type': 'text/html',
    })
    .get('/well-retrieve-article')
    .reply(200, HTML);

  test(`Testing with .extract(${url})`, (t) => {
    extract(url).then((art) => {
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

  test(`Testing with .extract(${URL})`, (t) => {
    extract(URL).catch((e) => {
      let msg = 'Error with contentType ""';
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });
})();

(() => {
  nock('https://medium.com')
    .get('/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6')
    .reply(200, 'SOMETHING NO HTML<html><b>ASD<</html>');

  test(`Testing with .extract(${URL})`, (t) => {
    extract(URL).catch((e) => {
      let msg = 'Error with contentType ""';
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });
})();

(() => {
  let url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  nock('https://medium.com')
    .get('/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6')
    .reply(500, HTML, {
      ok: false,
    });

  test(`Testing with .extract(${URL})`, (t) => {
    extract(URL).catch((e) => {
      let msg = `Fetching failed for "${url}"`;
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });
})();

(() => {
  let contentType = 'application/json';
  nock('https://medium.com')
    .get('/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6')
    .reply(200, HTML, {
      'Content-Type': contentType,
    });

  test(`Testing with .extract(${URL})`, (t) => {
    extract(URL).catch((e) => {
      let msg = `Error with contentType "application/json"`;
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });
})();

(() => {
  test(`Testing with .extract('')`, (t) => {
    extract('').catch((e) => {
      let msg = `Invalid URL`;
      t.equals(e.message, msg, 'It must return an error.');
    }).finally(t.end);
  });
})();

(() => {
  let url = 'https://blog.google/products/maps/lets-clear-air-mapping-our-environment-our-health/';
  test(`Testing with .extract(${url})`, (t) => {
    extract(url).then((art) => {
      t.ok(isObject(art), 'Extracted successfully');
    }).catch((e) => {
      console.log(e); // eslint-disable-line no-console
    }).finally(t.end);
  });
})();

(() => {
  let url = 'https://en.wikipedia.org/wiki/Ramen';
  test(`Testing with .extract(${url})`, (t) => {
    extract(url).then((art) => {
      t.ok(isObject(art), 'Extracted successfully');
    }).catch((e) => {
      console.log(e); // eslint-disable-line no-console
    }).finally(t.end);
  });

  test(`Testing with .extract(${url}) from cache`, (t) => {
    extract(url).then((art) => {
      t.ok(isObject(art), 'Extracted successfully');
    }).catch((e) => {
      console.log(e); // eslint-disable-line no-console
    }).finally(t.end);
  });
})();
