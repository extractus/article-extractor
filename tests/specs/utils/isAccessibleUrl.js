/**
 * Testing
 * @ndaidong
 */

import nock from 'nock';
import {test} from 'tap';

import isAccessibleUrl from '../../../src/utils/isAccessibleUrl.js';

test('Testing .isAccessibleUrl() method', async (assert) => {
  const baseUrl = 'http://some.where';

  const path200 = '/there/200';
  const path401 = '/there/401';
  const path404 = '/there/404';
  const path500 = '/there/500';

  nock(baseUrl).head(path200).reply(200, '');
  nock(baseUrl).head(path401).reply(401, '');
  nock(baseUrl).head(path404).reply(404, '');
  nock(baseUrl).head(path500).reply(500, '');

  const url200 = baseUrl + path200;
  const result200 = await isAccessibleUrl(url200);
  assert.ok(result200, `isAccessibleUrl('${url200}') must return true`);

  const url401 = baseUrl + path401;
  const result401 = await isAccessibleUrl(url401);
  assert.notOk(result401, `isAccessibleUrl('${url401}') must return false`);

  const url404 = baseUrl + path404;
  const result404 = await isAccessibleUrl(url404);
  assert.notOk(result404, `isAccessibleUrl('${url404}') must return false`);

  const url500 = baseUrl + path500;
  const result500 = await isAccessibleUrl(url500);
  assert.notOk(result500, `isAccessibleUrl('${url500}') must return false`);

  nock.cleanAll();
  assert.end();
});
