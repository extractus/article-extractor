const test = require('tap').test;

const {
  createAlias,
} = require('bellajs');

const chooseBestURL = require('../../../src/utils/chooseBestURL');

test('Testing findExtension method:', (assert) => {
  const title = 'Setup a lightweight environment for deep learning';
  const hashTitle = createAlias(title);
  const canonicals = [
    'http://goo.gl/ahk8a54',
    'http://m.medium.com/abcxyz',
    'https://medium.com/@ndaidong/setup-a-simple-environment-for-deep-learning-dc05c81c4914',
    'https://medium.com/@ndaidong/dc05c81c4914',
  ];
  const result = chooseBestURL(canonicals, hashTitle);
  const expect = canonicals[2];
  assert.ok(result === expect, `Result must be "${expect}"`);
  assert.end();
});
