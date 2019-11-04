/**
 * Testing
 * @ndaidong
 */

import {readFileSync} from 'fs';

import nock from 'nock';
import {test} from 'tap';

import retrieve from '../../../src/utils/retrieve.js';

test('Testing .retrieve() method', async (assert) => {
  const baseUrl = 'http://some.where';

  const path200 = '/there/200';
  const path20x = '/there/20x';
  const path401 = '/there/401';
  const path404 = '/there/404';
  const path500 = '/there/500';

  const html200File = './tests/data/technews.txt';

  nock(baseUrl).get(path200).replyWithFile(200, html200File, {
    'Content-Type': 'text/html',
  });
  nock(baseUrl).get(path20x).replyWithFile(200, html200File, {
    'Content-Type': 'application/json',
  });
  nock(baseUrl).get(path401).reply(401, '');
  nock(baseUrl).get(path404).reply(404, '');
  nock(baseUrl).get(path500).reply(500, '');

  const url200 = baseUrl + path200;
  const result200 = await retrieve(url200);
  const expected = {
    url: url200,
    resUrl: url200,
    html: readFileSync(html200File, 'utf8'),
    fromCache: false,
  };
  assert.same(result200, expected, `retrieve('${url200}') must be similar expected`);

  const result200Repeat = await retrieve(url200);
  assert.equal(
    result200Repeat.fromCache,
    true,
    `retrieve('${url200}') second time must load from cache`
  );

  const result200RepeatAgain = await retrieve(url200);
  assert.equal(
    result200RepeatAgain.fromCache,
    true,
    `retrieve('${url200}') third time must load from cache too`
  );

  const url20x = baseUrl + path20x;
  const result20x = await retrieve(url20x);
  assert.equal(result20x, null, `retrieve('${url20x}') must return null`);

  const url401 = baseUrl + path401;
  const result401 = await retrieve(url401);
  assert.equal(result401, null, `retrieve('${url401}') must return null`);

  const url404 = baseUrl + path404;
  const result404 = await retrieve(url404);
  assert.equal(result404, null, `retrieve('${url404}') must return null`);

  const url500 = baseUrl + path500;
  const result500 = await retrieve(url500);
  assert.equal(result500, null, `retrieve('${url500}') must return null`);

  nock.cleanAll();
  assert.end();
});
