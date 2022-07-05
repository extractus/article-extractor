// findRulesByUrl.test
/* eslint-env jest */

import { isFunction } from 'bellajs'

import { addQueryRules } from '../config.js'
import findRulesByUrl from './findRulesByUrl.js'

describe('test findRulesByUrl()', () => {
  addQueryRules([{
    patterns: [
      '*://makeuseof.com/*'
    ],
    unwanted: [
      '.example-adv',
      '.non-block-adv'
    ]
  }])

  const entries = [
    {
      urls: [{}, ''],
      expectation: []
    },
    {
      urls: ['https://zingnews.vn/article-slug.html'],
      expectation: (result, expect) => {
        expect(result).toHaveLength(1)
        expect(result[0].unwanted).toContain('.the-article-category')
      }
    },
    {
      urls: [1209, 'https://vietnamnet.vn/path/to/article'],
      expectation: (result, expect) => {
        expect(result).toHaveLength(1)
        expect(result[0]).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result[0].selector).toEqual('#ArticleContent')
      }
    },
    {
      urls: ['https://vnn.vn/path/to/article'],
      expectation: (result, expect) => {
        expect(result).toHaveLength(1)
        expect(result[0]).toEqual(expect.objectContaining({ selector: '#ArticleContent' }))
        expect(result[0].selector).toEqual('#ArticleContent')
      }
    },
    {
      urls: ['https://makeuseof.com/path/to/article'],
      expectation: (result, expect) => {
        expect(result).toHaveLength(2)
        expect(result[0].unwanted).toHaveLength(5)
        expect(result[0].unwanted.includes('.article-tags')).toBeTruthy()
        expect(result[1].unwanted).toHaveLength(2)
        expect(result[1].unwanted.includes('.non-block-adv')).toBeTruthy()
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
