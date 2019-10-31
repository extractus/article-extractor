/**
 * Testing
 * @ndaidong
 */

import {test} from 'tap';

import chooseBestUrl from '../../../src/utils/chooseBestUrl.js';

test('Testing .chooseBestUrl() method', (assert) => {
  const title = 'Google đã ra giá mua Fitbit';
  const urls = [
    'https://vnreview.vn/tin-tuc-kinh-doanh/-/view_content/content/2965950/google-da-ra-gia-mua-fitbit',
    'https://vnreview.vn/tin-tuc-kinh-doanh/view/2965950/907893219797',
    'https://vnreview.vn/tin-tuc-kinh-doanh/google-da-ra-gia-mua-fitbit',
    'https://rv.vn/read/google-da-ra-gia-mua-fitbit',
    'https://rv.vn/read/2965950/907893219797',
  ];

  const actual = chooseBestUrl(urls, title);
  const expected = urls[3];
  assert.equal(actual, expected, `chooseBestUrl("${title}") must return ${expected}`);

  assert.end();
});
