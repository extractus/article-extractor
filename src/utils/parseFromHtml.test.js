// parseFromHtml.test
/* eslint-env jest */

const {
  readFileSync
} = require('fs')

const { isFunction } = require('bellajs')

const parseFromHtml = require('./parseFromHtml')

describe('test parseFromHtml()', () => {
  const cases = [
    {
      input: {
        desc: 'a bad input',
        html: {}
      },
      expectation: null
    },
    {
      input: {
        desc: 'a webpage with no title',
        html: readFileSync('./test-data/html-no-title.html', 'utf8')
      },
      expectation: null
    },
    {
      input: {
        desc: 'a webpage with no main article',
        html: readFileSync('./test-data/html-no-article.html', 'utf8')
      },
      expectation: null
    },
    {
      input: {
        desc: 'a webpage with a very short article',
        html: readFileSync('./test-data/html-too-short-article.html', 'utf8'),
        url: 'abcd'
      },
      expectation: null
    },
    {
      input: {
        desc: 'a webpage with article but no source',
        html: readFileSync('./test-data/html-article-no-source.html', 'utf8')
      },
      expectation: (result, expect) => {
        expect(result.source).toEqual('somewhere.any')
      }
    },
    {
      input: {
        desc: 'a webpage with data-src in img tag',
        html: readFileSync('./test-data/html-article-with-data-src.html', 'utf8')
      },
      expectation: (result, expect) => {
        expect(result.content).toEqual(expect.stringContaining('<img src="https://somewhere.any/image1.jpg" />'))
        expect(result.content).toEqual(expect.stringContaining('<img src="https://somewhere.any/image2.jpg" />'))
      }
    },
    {
      input: {
        desc: 'a webpage with regular article',
        html: readFileSync('./test-data/regular-article.html', 'utf8'),
        url: 'https://somewhere.com/path/to/article'
      },
      expectation: (result, expect) => {
        expect(result.title).toEqual('Article title here')
        expect(result.description).toEqual('Few words to summarize this article content')
        expect(result.content).toEqual(expect.stringContaining('<a href="https://otherwhere.com/descriptions/rational-peach" target="_blank">'))
        expect(result.content).toEqual(expect.stringContaining('<a href="https://somewhere.com/dict/watermelon" target="_blank">'))
      }
    },
    {
      input: {
        desc: 'a webpage with unwanted elements',
        html: readFileSync('./test-data/vnn-article.html', 'utf8'),
        url: 'https://vnn.vn/path/to/article'
      },
      expectation: (result, expect) => {
        expect(result.title).toEqual('Article title here')
        expect(result.description).toEqual('Few words to summarize this article content')
        expect(result.content).toEqual(expect.stringContaining('<a href="https://otherwhere.com/descriptions/rational-peach" target="_blank">'))
        expect(result.content).toEqual(expect.stringContaining('<a href="https://vnn.vn/dict/watermelon" target="_blank">'))
        expect(result.content).toEqual(expect.not.stringContaining('Related articles'))
      }
    }
  ]

  cases.forEach((acase) => {
    const { input, expectation } = acase
    const { desc, html, url = '' } = input
    test(`check if parseFromHtml() works with ${desc}`, async () => {
      const result = await parseFromHtml(html, url)
      if (isFunction(expectation)) {
        expectation(result, expect)
      } else {
        expect(result).toEqual(expectation)
      }
    })
  })
})
