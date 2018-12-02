const test = require('tap').test;

const isValidURL = require('../../../src/utils/isValidURL');

test('Testing isValidURL method:', (assert) => {
  let url1 = 'http://lifehacker.com/hide-your-pin-number-or-password-on-a-fake-business-car-1766054555';
  let url2 = 'http://abc/xyz';
  let url3 = 'https://twitter.com/eon01/status/709157454140088324';
  let url4 = null;
  let r1 = isValidURL(url1);
  let r2 = isValidURL(url2);
  let r3 = isValidURL(url3);
  let r4 = isValidURL(url4);
  let e1 = true;
  let e2 = false;
  let e3 = true;
  let e4 = false;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${url1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${url2}`);
  assert.deepEqual(r3, e3, `Result must be ${e3} for ${url3}`);
  assert.deepEqual(r4, e4, `Result must be ${e4} for ${url4}`);
  assert.end();
});
