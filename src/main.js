/**
 * Article parser
 * @ndaidong
 **/

const {
  isString,
  unique,
  md5
} = require('bellajs')

const { hasProvider, extract: extractOembed } = require('oembed-parser')

const LRU = require('lru-cache')

const retrieve = require('./utils/retrieve')
const isHTMLString = require('./utils/isHTMLString')
const normalizeUrl = require('./utils/normalizeUrl')
const parseFromHtml = require('./utils/parseFromHtml')

const {
  info
} = require('./utils/logger')

const {
  setParserOptions,
  setFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getFetchOptions,
  getSanitizeHtmlOptions
} = require('./config')

const lruCache = new LRU({
  max: 500,
  maxAge: 6e4 * 30
})

const extract = async (input) => {
  if (!isString(input)) {
    throw new Error('Input must be a string')
  }

  if (isHTMLString(input)) {
    const result = await parseFromHtml(input, [])
    return result
  }

  const normalizedUrl = normalizeUrl(input.trim())
  if (!normalizedUrl) {
    throw new Error('Input must be a valid URL')
  }

  const key = md5(normalizedUrl)
  if (lruCache.has(key)) {
    return lruCache.get(key)
  }

  const links = [normalizedUrl]

  if (hasProvider(normalizedUrl)) {
    info('Provider found, loading as oEmbed data...')
    const embedded = {
      url: normalizedUrl,
      links: [],
      title: '',
      description: '',
      image: '',
      author: '',
      content: '',
      source: '',
      published: '',
      ttr: 0
    }
    const json = await extractOembed(normalizedUrl)
    if (json) {
      const {
        title = '',
        html: content = '',
        author_name: author = '',
        thumbnail_url: image = '',
        provider_name: source = '',
        url: embeddedUrl = ''
      } = json
      embedded.title = title
      embedded.content = content
      embedded.author = author
      embedded.image = image
      embedded.source = source
      if (embeddedUrl) {
        embedded.url = embeddedUrl
        links.push(embeddedUrl)
      }
      embedded.links = unique(links)
      embedded.links.forEach((link) => {
        lruCache.set(md5(link), embedded)
      })
      return embedded
    }
  }

  const res = await retrieve(normalizedUrl)
  if (!res) {
    throw new Error(`Could not retrieve content from "${normalizedUrl}"`)
  }

  const {
    html,
    url,
    resUrl
  } = res

  const article = await parseFromHtml(html, [...links, url, resUrl])
  if (article) {
    article.links.forEach((link) => {
      lruCache.set(md5(link), article)
    })
    return article
  }

  lruCache.set(key, null)
  return null
}

module.exports = {
  setParserOptions,
  setFetchOptions,
  setSanitizeHtmlOptions,
  getParserOptions,
  getFetchOptions,
  getSanitizeHtmlOptions,
  extract
}
