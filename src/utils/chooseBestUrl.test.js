// chooseBestUrl.test

const chooseBestUrl = require('./chooseBestUrl');


test(`test chooseBestUrl an actual case`, () => {
  const title = 'Google đã ra giá mua Fitbit';
  const urls = [
    'https://vnreview.vn/tin-tuc-kinh-doanh/-/view_content/content/2965950/google-da-ra-gia-mua-fitbit',
    'https://vnreview.vn/tin-tuc-kinh-doanh/view/2965950/907893219797',
    'https://vnreview.vn/tin-tuc-kinh-doanh/google-da-ra-gia-mua-fitbit',
    'https://rv.vn/read/google-da-ra-gia-mua-fitbit',
    'https://rv.vn/read/2965950/907893219797',
  ];
  const result = chooseBestUrl(urls, title);
  expect(result).toBe(urls[3]);
});
