// utils -> extractLdSchema.js

import { isArray, isObject, isString } from '@ndaidong/bellajs'

const typeSchemas = [
  'aboutpage',
  'checkoutpage',
  'collectionpage',
  'contactpage',
  'faqpage',
  'itempage',
  'medicalwebpage',
  'profilepage',
  'qapage',
  'realestatelisting',
  'searchresultspage',
  'webpage',
  'website',
  'article',
  'advertisercontentarticle',
  'newsarticle',
  'analysisnewsarticle',
  'askpublicnewsarticle',
  'backgroundnewsarticle',
  'opinionnewsarticle',
  'reportagenewsarticle',
  'reviewnewsarticle',
  'report',
  'satiricalarticle',
  'scholarlyarticle',
  'medicalscholarlyarticle',
]

const attributeLists = {
  description: 'description',
  image: 'image',
  author: 'author',
  published: 'datePublished',
  type: '@type',
}

const parseJson = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

const isAllowedLdJsonType = (ldJson) => {
  const rootLdJsonType = ldJson['@type'] || ''
  const arr = isArray(rootLdJsonType) ? rootLdJsonType : [rootLdJsonType]
  const ldJsonTypes = arr.filter(x => !!x)
  return ldJsonTypes.length > 0 && ldJsonTypes.some(x => typeSchemas.includes(x.toLowerCase()))
}

/**
 * Parses JSON-LD data from a document and populates an entry object.
 * Only populates if the original entry object is empty or undefined.
 *
 * @param {Document} document - The HTML Document
 * @param {Object} entry - The entry object to merge/populate with JSON-LD.
 * @returns {Object} The entry object after being merged/populated with data.
 */
export default (document, entry) => {
  const ldSchemas = document.querySelectorAll('script[type="application/ld+json"]')
  ldSchemas.forEach(ldSchema => {
    const ldJson = parseJson(ldSchema.textContent.replace(/[\n\r\t]/g, ''))
    if (ldJson && isAllowedLdJsonType(ldJson)) {
      Object.entries(attributeLists).forEach(([key, attr]) => {
        if (!entry[key] || !ldJson[attr]) {
          return
        }

        const keyValue = ldJson[attr]
        const val = isArray(keyValue) ? keyValue[0] : isObject(keyValue) ? keyValue?.name || '' : keyValue
        if (isString(val) && val !== '') {
          entry[key] = val.trim()
        }
      })
    }
  })

  return entry
}
