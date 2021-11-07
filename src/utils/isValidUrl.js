// utils -> isValidUrl

module.exports = (url = '') => {
  try {
    return new URL(url) !== null
  } catch (err) {
    return null
  }
}
