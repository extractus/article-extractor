// utils -> getTimeToRead

import {
  getParserOptions
} from '../config.js'

export default (text) => {
  const words = text.trim().split(/\s+/g).length
  const { wordsPerMinute } = getParserOptions()
  const minToRead = words / wordsPerMinute
  const secToRead = Math.ceil(minToRead * 60)
  return secToRead
}
