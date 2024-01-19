// utils -> html

import { DOMParser } from 'linkedom'
import sanitize from 'sanitize-html'
import { pipe } from 'bellajs'

import { getSanitizeHtmlOptions } from '../config.js'

export const purify = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
  })
}

const WS_REGEXP = /^[\s\f\n\r\t\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\x09\x0a\x0b\x0c\x0d\x20\xa0]+$/ // eslint-disable-line

const stripMultiLinebreaks = (str) => {
  return str.replace(/(\r\n|\n|\u2424){2,}/g, '\n').split('\n').map((line) => {
    return WS_REGEXP.test(line) ? line.trim() : line
  }).filter((line) => {
    return line.length > 0
  }).join('\n')
}

const stripMultispaces = (str) => {
  return str.replace(WS_REGEXP, ' ').trim()
}

export const cleanify = (inputHtml) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')
  const html = doc.documentElement.innerHTML
  return pipe(
    input => sanitize(input, getSanitizeHtmlOptions()),
    input => stripMultiLinebreaks(input),
    input => stripMultispaces(input)
  )(html)
}

export const imagify = (inputHtml) => {
  const doc = new DOMParser().parseFromString(inputHtml, 'text/html')
  const images = doc.querySelectorAll('img')
  const srcMap = new Map()
  images.forEach((item) => {
    if (item.src && /\.(jpg|jpeg|png|gif|bmp|svg)(.*)?$/i.test(item.src.toLowerCase())) {
      srcMap.set(new URL(item.src).toString(), item.src)
    }
  })
  return Array.from(new Set(Array.from(srcMap.values())))
}
