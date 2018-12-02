const test = require('tap').test;

const absolutifyURL = require('../../../src/utils/absolutifyURL');

test('Testing absolutifyURL method:', (assert) => {
  let fullUrl = 'http://abc.com/articles/somewhere/12930';
  let relativeUrl = '../images/cover.jpg';
  let r = absolutifyURL(fullUrl, relativeUrl);
  let e = 'http://abc.com/images/cover.jpg';
  assert.deepEqual(r, e, `Result must be ${e} for ${relativeUrl}`);

  let fail = absolutifyURL('c.com', false);
  assert.deepEqual(fail, '', `Result must be empty for ${relativeUrl}`);
  assert.end();
});
