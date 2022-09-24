// utils -> html

import { DOMParser } from 'linkedom'
import sanitize from 'sanitize-html'
import { pipe } from 'bellajs'

import { getSanitizeHtmlOptions } from '../config.js'

export const purify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false
  })
}

export const cleanify = (inputHtml, removeLineBreaks = true) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')
  const html = doc.documentElement.innerHTML
  return pipe(
    input => sanitize(input, getSanitizeHtmlOptions()),
    input => removeLineBreaks ? input.replace(/[\r\n]/gm, '') : input,
    input => input.replace(/  +/g, ' ').trim()
  )(html)
}
