// utils -> html

import { DOMParser } from 'linkedom'
import sanitize from 'sanitize-html'

import { getSanitizeHtmlOptions } from '../config.js'

export const purify = html => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

export const cleanify = (inputHtml) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')
  const html = doc.documentElement.innerHTML
  const cleanHtml = sanitize(html, getSanitizeHtmlOptions())
  return cleanHtml.replace(/[\r\n]/gm, '').replace(/  +/g, ' ').trim()
}
