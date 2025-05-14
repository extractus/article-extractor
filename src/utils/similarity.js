// similarity.js
// https://github.com/aceakash/string-similarity

import { isArray, isString } from '@ndaidong/bellajs'

const areArgsValid = (mainString, targetStrings) => {
  return isString(mainString) && isArray(targetStrings)
    && targetStrings.length > 0 && targetStrings.every(s => isString(s))
}

export const compareTwoStrings = (first, second) => {
  first = first.replace(/\s+/g, '')
  second = second.replace(/\s+/g, '')

  if (first === second) return 1 // identical or empty
  if (first.length < 2 || second.length < 2) return 0 // if either is a 0-letter or 1-letter string

  let firstBigrams = new Map()
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2)
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram) + 1
      : 1

    firstBigrams.set(bigram, count)
  }

  let intersectionSize = 0
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2)
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram)
      : 0

    if (count > 0) {
      firstBigrams.set(bigram, count - 1)
      intersectionSize++
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2)
}

export const findBestMatch = (mainString, targetStrings) => {
  if (!areArgsValid(mainString, targetStrings)) {
    throw new Error('Bad arguments: First argument should be a string, second should be an array of strings')
  }

  const ratings = []
  let bestMatchIndex = 0

  for (let i = 0; i < targetStrings.length; i++) {
    const currentTargetString = targetStrings[i]
    const currentRating = compareTwoStrings(mainString, currentTargetString)
    ratings.push({ target: currentTargetString, rating: currentRating })
    if (currentRating > ratings[bestMatchIndex].rating) {
      bestMatchIndex = i
    }
  }

  const bestMatch = ratings[bestMatchIndex]

  return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex }
}
