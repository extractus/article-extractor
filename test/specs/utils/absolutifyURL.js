const test = require('tap').test;

const absolutifyURL = require('../../../src/utils/absolutifyURL');

test('Testing absolutifyURL method:', (assert) => {
  const fullUrl = 'http://abc.com/articles/somewhere/12930';
  const relativeUrl = '../images/cover.jpg';
  const r = absolutifyURL(fullUrl, relativeUrl);
  const e = 'http://abc.com/images/cover.jpg';
  assert.deepEqual(r, e, `Result must be ${e} for ${relativeUrl}`);

  const fail = absolutifyURL('c.com', false);
  assert.deepEqual(fail, '', `Result must be empty for ${relativeUrl}`);
  assert.end();
});
