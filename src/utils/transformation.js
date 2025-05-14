// utils --> transformation.js

import { isArray, isFunction, clone } from '@ndaidong/bellajs'
import { DOMParser } from 'linkedom'

const transformations = []

const add = (tn) => {
  const { patterns } = tn
  if (!patterns || !isArray(patterns) || !patterns.length) {
    return 0
  }
  transformations.push(tn)
  return 1
}

export const addTransformations = (tfms) => {
  if (isArray(tfms)) {
    return tfms.map(tfm => add(tfm)).filter(result => result === 1).length
  }
  return add(tfms)
}

export const removeTransformations = (patterns) => {
  if (!patterns) {
    const removed = transformations.length
    transformations.length = 0
    return removed
  }
  let removing = 0
  for (let i = transformations.length - 1; i > 0; i--) {
    const { patterns: ipatterns } = transformations[i]
    const matched = ipatterns.some((ptn) => patterns.some((pattern) => String(pattern) === String(ptn)))
    if (matched) {
      transformations.splice(i, 1)
      removing += 1
    }
  }
  return removing
}

export const getTransformations = () => {
  return clone(transformations)
}

export const findTransformations = (links) => {
  const urls = !isArray(links) ? [links] : links
  const tfms = []
  for (const transformation of transformations) {
    const { patterns } = transformation
    const matched = urls.some((url) => patterns.some((pattern) => pattern.test(url)))
    if (matched) {
      tfms.push(clone(transformation))
    }
  }
  return tfms
}

export const execPreParser = (html, links) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  findTransformations(links).map(tfm => tfm.pre).filter(fn => isFunction(fn)).map(fn => fn(doc))
  return Array.from(doc.childNodes).map(it => it.outerHTML).join('')
}

export const execPostParser = (html, links) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  findTransformations(links).map(tfm => tfm.post).filter(fn => isFunction(fn)).map(fn => fn(doc))
  return Array.from(doc.childNodes).map(it => it.outerHTML).join('')
}
