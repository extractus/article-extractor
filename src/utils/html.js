// utils -> html

import { DOMParser } from 'linkedom'
import sanitize from 'sanitize-html'
import { crush } from 'html-crush'

import { getSanitizeHtmlOptions } from '../config.js'

export const isValid = (str = '') => {
  const reg = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i
  return reg.test(str)
}

export const cleanify = html => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

const htmlCrushOptions = {
  removeHTMLComments: 2,
  removeLineBreaks: true
}

/**
 * @param inputHtml {string}
 * @returns cleanHtml {string}
 */
export const cleanAndMinify = (inputHtml) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')

  const html = doc.documentElement.innerHTML

  const crushed = crush(html, htmlCrushOptions)

  const cleanHtml = sanitize(crushed.result, getSanitizeHtmlOptions())

  return cleanHtml.trim()
}
