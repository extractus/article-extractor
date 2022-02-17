// utils/extractWithRules

import { stripTags } from 'bellajs'

import logger from './logger.js'
import { DOMParser } from 'linkedom'

const MIN_SECTION_LENGTH = 100
const MIN_TEXT_LENGTH = 20

const countWord = (text) => {
  return text.length > 0 ? text.split(/\s+/).length : 0
}

export default (html, selector = null, exclusions = []) => {
  try {
    const $article = new DOMParser().parseFromString(html, 'text/html')
    for (const exclusion of exclusions) {
      $article.querySelectorAll(exclusion).forEach(node => node.remove())
    }
    const parts = []
    $article.querySelectorAll(selector).forEach(node => {
      const text = node.innerHTML.trim()
      if (countWord(text) >= MIN_SECTION_LENGTH) { parts.push(text) }
    })

    if (parts.length) {
      return parts
        .reduce((prev, curr) => prev.concat([curr]), [])
        .filter((sect) => stripTags(sect).length > MIN_TEXT_LENGTH)
        .join('')
    }

    return $article.documentElement.innerHTML
  } catch (err) {
    logger.error(err)
  }

  return null
}
