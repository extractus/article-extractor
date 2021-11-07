// utils -> parseFromHtml

const {
  unique,
  stripTags,
  truncate
} = require('bellajs')

const sanitize = require('sanitize-html')

const extractMetaData = require('./extractMetaData')
const chooseBestUrl = require('./chooseBestUrl')
const absolutifyUrl = require('./absolutifyUrl')
const normalizeUrl = require('./normalizeUrl')
const isValidUrl = require('./isValidUrl')
const standalizeArticle = require('./standalizeArticle')
const extractWithRules = require('./extractWithRules')
const extractWithReadability = require('./extractWithReadability')
const getTimeToRead = require('./getTimeToRead')

const { getParserOptions } = require('../config')

const {
  info
} = require('./logger')

const cleanify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

const summarize = (desc, txt, threshold, maxlen) => {
  return desc.length < threshold ? truncate(txt, maxlen) : desc
}

const getSource = (source, uri) => {
  return source || (() => {
    const { hostname } = new URL(uri)
    return hostname
  })()
}

module.exports = async (input, links = []) => {
  info('Start parsing from HTML...')
  const html = cleanify(input)
  const meta = extractMetaData(html)

  const {
    title = '',
    description = '',
    image = '',
    author = '',
    source = '',
    published = ''
  } = meta;

  [
    'url',
    'shortlink',
    'amphtml',
    'canonical'
  ].forEach((p) => {
    if (meta[p]) {
      links.push(meta[p])
    }
  })

  if (!title || links.length === 0) {
    info('No `title` or `url` detected, stop processing')
    return null
  }

  info('Extracting main article...')
  const mainText = extractWithRules(html) || await extractWithReadability(html)
  if (!mainText || !stripTags(mainText)) {
    info('Could not extract main article, stop processing')
    return null
  }

  info('Finding the best link...')
  const ulinks = unique(links.filter(isValidUrl).map(normalizeUrl))
  const bestUrl = chooseBestUrl(ulinks, title)

  info('Normalizing content')
  const {
    descriptionLengthThreshold,
    descriptionTruncateLen,
    contentLengthThreshold
  } = getParserOptions()

  const normalizedContent = await standalizeArticle(mainText, bestUrl)
  const textContent = stripTags(normalizedContent)
  if (textContent.length < contentLengthThreshold) {
    info('Main article is too short!')
    return null
  }

  info('Finish parsing process')
  return {
    url: bestUrl,
    title,
    description: summarize(
      description,
      textContent,
      descriptionLengthThreshold,
      descriptionTruncateLen
    ),
    links: ulinks,
    image: image ? absolutifyUrl(bestUrl, image) : '',
    content: normalizedContent,
    author,
    source: getSource(source, bestUrl),
    published,
    ttr: getTimeToRead(textContent)
  }
}
