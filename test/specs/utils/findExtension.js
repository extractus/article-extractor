const test = require('tap').test;

const {
  isObject,
  isArray,
  isFunction,
} = require('bellajs');

const findExtension = require('../../../src/utils/findExtension');

test('Testing findExtension method:', (assert) => {
  const url = 'https://www.youtube.com/watch?v=okMVc3-aCKQ';
  const result = findExtension(url);

  assert.ok(isObject(result), `result must be an object`);
  assert.ok(isArray(result.schemes), `result.schemes must be array`);
  assert.ok(isFunction(result.extract), `result.extract must be function`);
  assert.end();
});
