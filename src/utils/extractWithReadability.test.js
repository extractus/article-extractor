// extractWithReadability.test

const {readFileSync} = require('fs');

const {isString} = require('bellajs');

const extractWithReadability = require('./extractWithReadability');

test(`test extractWithReadability from good html content`, async () => {
  const html = readFileSync('./test-data/venturebeat.txt', 'utf8');
  const result = await extractWithReadability(html);
  expect(isString(result)).toBe(true);
  expect(result.length > 200).toBe(true);
});

test(`test extractWithReadability from bad html content`, async () => {
  const result = await extractWithReadability(null);
  expect(result).toBe(null);
});
