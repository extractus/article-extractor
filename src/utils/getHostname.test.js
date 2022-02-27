// getHostname.test
/* eslint-env jest */

import getHostname from './getHostname.js'

describe('test getHostname()', () => {
  const entries = [
    {
      url: '',
      expected: ''
    },
    {
      url: {},
      expected: ''
    },
    {
      url: 'https://www.some.where/article/abc-xyz',
      expected: 'some.where'
    },
    {
      url: 'https://www.alpha.some.where/blog/authors/article/abc-xyz',
      expected: 'alpha.some.where'
    },
    {
      url: 'https://10.1.1.5:1888/article/abc-xyz',
      expected: '10.1.1.5'
    }
  ]
  entries.forEach((entry) => {
    const {
      url,
      expected
    } = entry
    test(`absolutifyUrl("${url}") must become "${expected}"`, () => {
      const result = getHostname(url)
      expect(result).toEqual(expected)
    })
  })
})
