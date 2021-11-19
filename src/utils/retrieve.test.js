// retrieve.test
/* eslint-env jest */

const { URL } = require('url')

const nock = require('nock')

const retrieve = require('./retrieve')

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname
  }
}

test('test retrieve from good source', async () => {
  const url = 'https://some.where/good/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, '<div>this is content</div>', {
    'Content-Type': 'text/plain'
  })
  const result = await retrieve(url)
  expect(result.html).toBe('<div>this is content</div>')
})

test('test retrieve from bad source', async () => {
  const url = 'https://some.where/bad/page'
  const { baseUrl, path } = parseUrl(url)
  nock(baseUrl).head(path).reply(200)
  nock(baseUrl).get(path).reply(200, '', {
    'Content-Type': 'something/strange'
  })
  const result = await retrieve(url)
  expect(result).toBe(null)
})
