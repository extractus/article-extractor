// utils -> parseFromHtml

const {
  unique,
  stripTags,
  truncate
} = require('bellajs')

const sanitize = require('sanitize-html')

const isValidUrl = require('./isValidUrl')
const purifyUrl = require('./purifyUrl')
const absolutifyUrl = require('./absolutifyUrl')
const chooseBestUrl = require('./chooseBestUrl')
const getHostname = require('./getHostname')

const extractMetaData = require('./extractMetaData')
const extractWithReadability = require('./extractWithReadability')
const extractWithSelector = require('./extractWithSelector')

const standalizeArticle = require('./standalizeArticle')
const getTimeToRead = require('./getTimeToRead')

const logger = require('./logger')

const { getParserOptions } = require('../config')

const cleanify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

const summarize = (desc, txt, threshold, maxlen) => {
  return desc.length < threshold ? truncate(txt, maxlen).replace(/\n/g, ' ') : desc
}

const parseHtml = async (rawhtml, selector, inputUrl = '') => {
  const html = cleanify(rawhtml)
  const meta = extractMetaData(html)

  // gather title
  if (!meta.title) {
    logger.info('Could not detect article title!')
    return null
  }

  const {
    url,
    shortlink,
    amphtml,
    canonical,
    title,
    description: metaDesc,
    image: metaImg,
    author,
    source,
    published
  } = meta

  // gather urls to choose the best url later
  const links = unique([
    url,
    shortlink,
    amphtml,
    canonical,
    inputUrl
  ].filter(isValidUrl).map(purifyUrl))

  if (links.length === 0) {
    logger.info('Could not detect article link!')
    return null
  }

  // choose the best url
  const bestUrl = chooseBestUrl(links, title)

  // find article content
  const mainContent = selector ? extractWithSelector(html, selector) : null
  const content = extractWithReadability(mainContent || html, bestUrl)

  if (!content) {
    logger.info('Could not detect article content!')
    return null
  }
  const {
    descriptionLengthThreshold,
    descriptionTruncateLen,
    contentLengthThreshold
  } = getParserOptions()

  const normalizedContent = await standalizeArticle(content, bestUrl)

  const textContent = stripTags(normalizedContent)
  if (textContent.length < contentLengthThreshold) {
    logger.info('Main article is too short!')
    return null
  }

  const description = summarize(
    metaDesc,
    textContent,
    descriptionLengthThreshold,
    descriptionTruncateLen
  )

  const image = metaImg ? absolutifyUrl(bestUrl, metaImg) : ''

  return {
    url: bestUrl,
    title,
    description,
    links,
    image,
    content: normalizedContent,
    author,
    source: source || getHostname(bestUrl),
    published,
    ttr: getTimeToRead(textContent)
  }
}

module.exports = parseHtml
