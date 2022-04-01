// utils -> parseFromHtml

import { stripTags, truncate, unique } from 'bellajs'

import sanitize from 'sanitize-html'

import isValidUrl from './isValidUrl.js'
import purifyUrl from './purifyUrl.js'
import absolutifyUrl from './absolutifyUrl.js'
import chooseBestUrl from './chooseBestUrl.js'
import getHostname from './getHostname.js'

import findRulesByUrl from './findRulesByUrl.js'
import cleanAndMinifyHtml from './cleanAndMinifyHtml.js'
import extractMetaData from './extractMetaData.js'
import extractWithReadability, {
  extractTitleWithReadability
} from './extractWithReadability.js'
import extractWithSelector from './extractWithSelector.js'
import getTimeToRead from './getTimeToRead.js'
import normalizeUrls from './normalizeUrls.js'
import stripUnwantedTags from './stripUnwantedTags.js'
import transformHtml from './transformHtml.js'

import logger from './logger.js'

import { getParserOptions } from '../config.js'

const cleanify = html => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

const summarize = (desc, txt, threshold, maxlen) => {
  return desc.length < threshold
    ? truncate(txt, maxlen).replace(/\n/g, ' ')
    : desc
}

export default async (inputHtml, inputUrl = '') => {
  const html = cleanify(inputHtml)
  const meta = extractMetaData(html)
  let title = meta.title

  const {
    url,
    shortlink,
    amphtml,
    canonical,
    description: metaDesc,
    image: metaImg,
    author,
    source,
    published
  } = meta

  const {
    descriptionLengthThreshold,
    descriptionTruncateLen,
    contentLengthThreshold
  } = getParserOptions()

  // gather title
  if (!title) {
    logger.info('Could not detect article title from meta!')
    title = extractTitleWithReadability(html, inputUrl)
  }
  if (!title) {
    logger.info('Could not detect article title!')
    return null
  }

  // gather urls to choose the best url later
  const links = unique(
    [url, shortlink, amphtml, canonical, inputUrl]
      .filter(isValidUrl)
      .map(purifyUrl)
  )

  if (!links.length) {
    logger.info('Could not detect article link!')
    return null
  }

  // choose the best url
  const bestUrl = chooseBestUrl(links, title)

  // get defined selector
  const {
    selector = null,
    unwanted = [],
    transform = null
  } = findRulesByUrl(links)

  // find article content
  const mainContentSelected = extractWithSelector(html, selector)

  const mainContent = stripUnwantedTags(mainContentSelected ?? html, unwanted)

  const mainContentAbsoluteUrls = normalizeUrls(mainContent, bestUrl)

  const transformedContent = transformHtml(mainContentAbsoluteUrls, transform)

  const content = extractWithReadability(transformedContent, bestUrl)

  if (!content) {
    logger.info('Could not detect article content!')
    return null
  }

  const normalizedContent = cleanAndMinifyHtml(content)

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
