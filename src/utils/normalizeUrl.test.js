// normalizeUrl.test
/* eslint-env jest */

const normalizeUrl = require('./normalizeUrl')

test('test normalizeUrl in detailt', () => {
  const entries = [
    {
      url: 'https://some.where/article/abc-xyz',
      expected: 'https://some.where/article/abc-xyz'
    },
    {
      url: 'https://some.where/article/abc-xyz#name,bob',
      expected: 'https://some.where/article/abc-xyz'
    },
    {
      url: 'https://some.where/article/abc-xyz?utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz'
    },
    {
      url: 'https://some.where/article/abc-xyz?q=3&utm_source=news4&utm_medium=email&utm_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz?q=3'
    },
    {
      url: 'https://some.where/article/abc-xyz?pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz'
    },
    {
      url: 'https://some.where/article/abc-xyz?q=3&pk_source=news4&pk_medium=email&pk_campaign=spring-summer',
      expected: 'https://some.where/article/abc-xyz?q=3'
    }
  ]
  entries.forEach((entry) => {
    const {
      url,
      expected
    } = entry
    const result = normalizeUrl(url)
    expect(result).toEqual(expected)
  })
})
