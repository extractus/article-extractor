// utils -> retrieve

import fetch from 'cross-fetch'

const profetch = async (url, proxy = {}) => {
  const {
    target,
    headers = {},
  } = proxy
  const res = await fetch(target + encodeURIComponent(url), {
    headers,
  })
  return res
}

export default async (url, options = {}) => {
  const { proxy } = options
  const res = proxy ? await profetch(url, proxy) : await fetch(url, options)
  const status = res.status
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`)
  }
  const text = await res.text()
  return text.trim()
}
