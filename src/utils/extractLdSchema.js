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
    return null
  }
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
  const ldSchema = document.querySelector('script[type="application/ld+json"]')?.textContent

  const ldJson = ldSchema ? parseJson(ldSchema) : null

  if (ldJson) {
    Object.entries(attributeLists).forEach(([key, attr]) => {
      if ((typeof entry[key] === 'undefined' || entry[key] === '') && ldJson[attr]) {
        if (key === 'type' && typeof ldJson[attr] === 'string') {
          return entry[key] = typeSchemas.includes(ldJson[attr].toLowerCase()) ? ldJson[attr].toLowerCase() : ''
        }

        if (typeof ldJson[attr] === 'string') {
          return entry[key] = ldJson[attr].toLowerCase()
        }

        if (Array.isArray(ldJson[attr]) && typeof ldJson[attr][0] === 'string') {
          return entry[key] = ldJson[attr][0].toLowerCase()
        }
      }
    })
  }

  return entry
}
