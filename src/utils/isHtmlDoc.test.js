// isHtmlDoc.test

const isHtmlDoc = require('./isHtmlDoc');


test(`test isHtmlDoc a bad input`, () => {
  const result = isHtmlDoc({});
  expect(result).toBe(false);
});
