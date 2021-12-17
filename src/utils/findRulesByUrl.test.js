// findRulesByUrl.test
/* eslint-env jest */

const { isFunction } = require('bellajs')

const findRulesByUrl = require('./findRulesByUrl')

describe('test findRulesByUrl()', () => {
  const entries = [
    {
      url: '',
      expectation: {}
    },
    {
      url: {},
      expectation: {}
    },
    {
      url: 'https://vietnamnet.vn/path/to/article',
      expectation: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result.selector).toEqual('#ArticleContent')
      }
    },
    {
      url: 'https://vnn.vn/path/to/article',
      expectation: (result, expect) => {
        expect(result).toBeTruthy()
        expect(result).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result.selector).toEqual('#ArticleContent')
      }
    }
  ]
  entries.forEach((entry) => {
    const {
      url,
      expectation
    } = entry
    test(`check if findRulesByUrl("${url}") works correctly`, () => {
      const result = findRulesByUrl(url)
      if (isFunction(expectation)) {
        expectation(result, expect)
      } else {
        expect(result).toEqual(expectation)
      }
    })
  })
})
