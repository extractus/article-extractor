// utils -> cleanAndMinifyHtml

import sanitize from 'sanitize-html'

import { crush } from 'html-crush'

import { getHtmlCrushOptions, getSanitizeHtmlOptions } from '../config.js'

import { DOMParser } from 'linkedom'

/**
 * @param inputHtml {string}
 * @returns cleanHtml {string}
 */
export default inputHtml => {
  const $article = new DOMParser().parseFromString(inputHtml, 'text/html')

  const html = $article.documentElement.innerHTML

  const crushed = crush(html, getHtmlCrushOptions())

  const cleanHtml = sanitize(crushed.result, getSanitizeHtmlOptions())

  return cleanHtml.trim()
}
