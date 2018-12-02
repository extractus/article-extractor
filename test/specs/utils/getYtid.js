const test = require('tap').test;

const getYtid = require('../../../src/utils/getYtid');

test('Testing getYtid method:', (assert) => {
  let url1 = 'http://www.youtube.com/watch?v=709157454140';
  let url2 = 'http://youtu.be/709157454140';
  let url3 = 'https://www.youtube.com/v/709157454140';
  let url4 = 'https://www.youtube.com/embed/709157454140?';
  let r1 = getYtid(url1);
  let r2 = getYtid(url2);
  let r3 = getYtid(url3);
  let r4 = getYtid(url4);
  let exp = '709157454140';
  assert.deepEqual(r1, exp, `Result must be ${exp} for ${url1}`);
  assert.deepEqual(r2, exp, `Result must be ${exp} for ${url2}`);
  assert.deepEqual(r3, exp, `Result must be ${exp} for ${url3}`);
  assert.deepEqual(r4, exp, `Result must be ${exp} for ${url4}`);
  assert.end();
});
