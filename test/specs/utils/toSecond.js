const test = require('tap').test;

const toSecond = require('../../../src/utils/toSecond');

test('Testing toSecond method:', (assert) => {
  const t1 = 'PT3M20S';
  const t2 = 'PT3H2M31S';
  const r1 = toSecond(t1);
  const r2 = toSecond(t2);
  const e1 = 200;
  const e2 = 10951;
  assert.deepEqual(r1, e1, `Result must be ${e1} for ${t1}`);
  assert.deepEqual(r2, e2, `Result must be ${e2} for ${t2}`);
  assert.end();
});
