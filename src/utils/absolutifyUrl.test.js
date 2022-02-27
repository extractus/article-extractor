// absolutifyUrl.test
/* eslint-env jest */

import absolutifyUrl from './absolutifyUrl.js'

describe('test absolutifyUrl()', () => {
  const entries = [
    {
      full: '',
      expected: ''
    },
    {
      relative: {},
      expected: ''
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: 'category/page.html',
      expected: 'https://some.where/article/category/page.html'
    },
    {
      full: 'https://some.where/article/abc-xyz',
      relative: '../category/page.html',
      expected: 'https://some.where/category/page.html'
    },
    {
      full: 'https://some.where/blog/authors/article/abc-xyz',
      relative: '/category/page.html',
      expected: 'https://some.where/category/page.html'
    },
    {
      full: 'https://some.where/article/abc-xyz',
      expected: 'https://some.where/article/abc-xyz'
    }
  ]
  entries.forEach((entry) => {
    const {
      full,
      relative,
      expected
    } = entry
    test(`absolutifyUrl("${full}", "${relative}") must become "${expected}"`, () => {
      const result = absolutifyUrl(full, relative)
      expect(result).toEqual(expected)
    })
  })
})
