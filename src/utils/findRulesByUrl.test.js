// findRulesByUrl.test
/* eslint-env jest */

const { isFunction } = require('bellajs')

const findRulesByUrl = require('./findRulesByUrl')

describe('test findRulesByUrl()', () => {
  const entries = [
    {
      urls: [{}, ''],
      expectation: {}
    },
    {
      urls: [1209, 'https://vietnamnet.vn/path/to/article'],
      expectation: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result.selector).toEqual('#ArticleContent')
      }
    },
    {
      urls: ['https://vnn.vn/path/to/article'],
      expectation: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result.selector).toEqual('#ArticleContent')
      }
    }
  ]
  entries.forEach((entry) => {
    const {
      urls,
      expectation
    } = entry
    test('check if findRulesByUrl() works correctly', () => {
      const result = findRulesByUrl(urls)
      if (isFunction(expectation)) {
        expectation(result, expect)
      } else {
        expect(result).toEqual(expectation)
      }
    })
  })
})
