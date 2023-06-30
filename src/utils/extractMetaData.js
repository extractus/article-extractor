// utils -> extractMetaData

import { DOMParser } from 'linkedom'

/**
 * @param html {string}
 * @returns {{image: string, author: string, amphtml: string, description: string, canonical: string, source: string, published: string, title: string, url: string, shortlink: string, favicon: string}}
 */
export default (html) => {
  const entry = {
    url: '',
    shortlink: '',
    amphtml: '',
    canonical: '',
    title: '',
    description: '',
    image: '',
    author: '',
    source: '',
    published: '',
    favicon: '',
  }

  const sourceAttrs = [
    'application-name',
    'og:site_name',
    'twitter:site',
    'dc.title',
  ]
  const urlAttrs = [
    'og:url',
    'twitter:url',
    'parsely-link',
  ]
  const titleAttrs = [
    'title',
    'og:title',
    'twitter:title',
    'parsely-title',
  ]
  const descriptionAttrs = [
    'description',
    'og:description',
    'twitter:description',
    'parsely-description',
  ]
  const imageAttrs = [
    'image',
    'og:image',
    'og:image:url',
    'og:image:secure_url',
    'twitter:image',
    'twitter:image:src',
    'parsely-image-url',
  ]
  const authorAttrs = [
    'author',
    'creator',
    'og:creator',
    'article:author',
    'twitter:creator',
    'dc.creator',
    'parsely-author',
  ]
  const publishedTimeAttrs = [
    'article:published_time',
    'article:modified_time',
    'og:updated_time',
    'dc.date',
    'dc.date.issued',
    'dc.date.created',
    'dc:created',
    'dcterms.date',
    'datepublished',
    'datemodified',
    'updated_time',
    'modified_time',
    'published_time',
    'release_date',
    'date',
    'parsely-pub-date',
  ]

  const document = new DOMParser().parseFromString(html, 'text/html')
  entry.title = document.querySelector('head > title')?.innerText

  Array.from(document.getElementsByTagName('link')).forEach(node => {
    const rel = node.getAttribute('rel')
    const href = node.getAttribute('href')
    if (rel && href) {
      entry[rel] = href
      if (rel === 'icon' || rel === 'shortcut icon') {
        entry.favicon = href
      }
    }
  })

  Array.from(document.getElementsByTagName('meta')).forEach(node => {
    const content = node.getAttribute('content')
    if (!content) {
      return false
    }
    const property = node.getAttribute('property')?.toLowerCase() ?? node.getAttribute('itemprop')?.toLowerCase()
    const name = node.getAttribute('name')?.toLowerCase()

    if (sourceAttrs.includes(property) || sourceAttrs.includes(name)) {
      entry.source = content
    }
    if (urlAttrs.includes(property) || urlAttrs.includes(name)) {
      entry.url = content
    }
    if (titleAttrs.includes(property) || titleAttrs.includes(name)) {
      entry.title = content
    }
    if (descriptionAttrs.includes(property) || descriptionAttrs.includes(name)) {
      entry.description = content
    }
    if (imageAttrs.includes(property) || imageAttrs.includes(name)) {
      entry.image = content
    }
    if (authorAttrs.includes(property) || authorAttrs.includes(name)) {
      entry.author = content
    }
    if (publishedTimeAttrs.includes(property) || publishedTimeAttrs.includes(name)) {
      entry.published = content
    }
  })

  return entry
}
