// utils -> html

import { DOMParser } from 'linkedom'
import sanitize from 'sanitize-html'

import { getSanitizeHtmlOptions } from '../config.js'

export const isValid = (str = '') => {
  const reg = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i
  return reg.test(str)
}

export const purify = html => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

/**
 * @param inputHtml {string}
 * @returns cleanHtml {string}
 */
export const cleanify = (inputHtml) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')
  const html = doc.documentElement.innerHTML
  const cleanHtml = sanitize(html, getSanitizeHtmlOptions())
  return cleanHtml.replace(/[\r\n]/gm, '').replace(/  +/g, ' ').trim()
}
