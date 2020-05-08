// parseFromHtml.test

const {
  readFileSync,
} = require('fs');

const parseFromHtml = require('./parseFromHtml');


test(`test parseFromHtml a webpage with no title`, async () => {
  const html = readFileSync('./test-data/html-no-title.html', 'utf8');
  const result = await parseFromHtml(html, []);
  expect(result).toBe(null);
});

test(`test parseFromHtml a webpage with no main article`, async () => {
  const html = readFileSync('./test-data/html-no-article.html', 'utf8');
  const result = await parseFromHtml(html, ['abcd']);
  expect(result).toBe(null);
});


test(`test parseFromHtml a webpage with very short article`, async () => {
  const html = readFileSync('./test-data/html-too-short-article.html', 'utf8');
  const result = await parseFromHtml(html, ['abcd']);
  expect(result).toBe(null);
});

test(`test parseFromHtml a webpage with article but no source`, async () => {
  const html = readFileSync('./test-data/html-article-no-source.html', 'utf8');
  const result = await parseFromHtml(html, ['abcd']);
  expect(result).toBeInstanceOf(Object);
});
