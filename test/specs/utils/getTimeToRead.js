const test = require('tap').test;

const Chance = require('chance');
const chance = new Chance();

const getTimeToRead = require('../../../src/utils/getTimeToRead');

test('Testing getTimeToRead method - 1min:', (assert) => {
  let sentence = chance.sentence({words: 300});
  let timeToRead = getTimeToRead(sentence);
  assert.deepEqual(timeToRead, 60, 'timeToRead must be 60');
  assert.end();
});

test('Testing getTimeToRead method - 2min:', (assert) => {
  let sentence = chance.sentence({words: 600});
  let timeToRead = getTimeToRead(sentence);
  assert.deepEqual(timeToRead, 120, 'timeToRead must be 120');
  assert.end();
});
