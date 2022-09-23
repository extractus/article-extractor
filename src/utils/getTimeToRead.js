// utils -> getTimeToRead

export default (text, wordsPerMinute) => {
  const words = text.trim().split(/\s+/g).length
  const minToRead = words / wordsPerMinute
  const secToRead = Math.ceil(minToRead * 60)
  return secToRead
}
