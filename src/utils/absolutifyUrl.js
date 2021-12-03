// utils -> absolutifyUrl

module.exports = (fullUrl = '', relativeUrl = '') => {
  try {
    const result = new URL(relativeUrl, fullUrl)
    return result.toString()
  } catch (err) {
    return ''
  }
}
