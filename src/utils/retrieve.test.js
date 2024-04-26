// retrieve.test
/* eslint-env jest */

import nock from 'nock'

import retrieve from './retrieve.js'

const parseUrl = (url) => {
  const re = new URL(url)
  return {
    baseUrl: `${re.protocol}//${re.host}`,
    path: re.pathname,
  }
}

describe('test retrieve() method', () => {
  test('test retrieve with bad status code', async () => {
    const url = 'https://some.where/bad/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(500, 'Error 500')
    expect(retrieve(url)).rejects.toThrow(new Error('Request failed with error code 500'))
  })

  test('test retrieve from good source', async () => {
    const url = 'https://some.where/good/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '<div>this is content</div>', {
      'Content-Type': 'text/html',
    })
    const buffer = await retrieve(url)
    const html = Buffer.from(buffer).toString()
    expect(html).toEqual('<div>this is content</div>')
  })

  test('test retrieve from good source with \\r\\n', async () => {
    const url = 'https://some.where/good/page'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, '\n\r\r\n\n<div>this is content</div>\n\r\r\n\n', {
      'Content-Type': 'text/html',
    })
    const buffer = await retrieve(url)
    const html = Buffer.from(buffer).toString().trim()
    expect(html).toEqual('<div>this is content</div>')
  })

  test('test retrieve using proxy', async () => {
    const url = 'https://some.where/good/source-with-proxy'
    const { baseUrl, path } = parseUrl(url)
    nock(baseUrl).get(path).reply(200, 'something bad', {
      'Content-Type': 'bad/thing',
    })
    nock('https://proxy-server.com')
      .get('/api/proxy?url=https%3A%2F%2Fsome.where%2Fgood%2Fsource-with-proxy')
      .reply(200, '<div>this is content</div>', {
        'Content-Type': 'text/html',
      })

    const buffer = await retrieve(url, {
      proxy: {
        target: 'https://proxy-server.com/api/proxy?url=',
      },
    })
    const html = Buffer.from(buffer).toString()
    expect(html).toEqual('<div>this is content</div>')
    nock.cleanAll()
  })
})
