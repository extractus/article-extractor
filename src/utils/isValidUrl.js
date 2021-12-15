// utils -> isValidUrl

module.exports = (url = '') => {
  try {
    const ourl = new URL(url)
    return ourl !== null && ourl.protocol.startsWith('http')
  } catch (err) {
    return false
  }
}
