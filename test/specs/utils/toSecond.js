const test = require('tap').test;

const toSecond = require('../../../src/utils/toSecond');

test('Testing toSecond method:', (assert) => {
  let t1 = 'PT3M20S';
  let t2 = 'PT3H2M31S';
  let r1 = toSecond(t1);
  let r2 = toSecond(t2);
  let e1 = 200;
  let e2 = 10951;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${t1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${t2}`);
  assert.end();
});
