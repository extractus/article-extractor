// utils -> retrieve

import fetch from 'cross-fetch'

const profetch = async (url, options = {}) => {
  const { proxy = {}, signal = null } = options
  const {
    target,
    headers = {},
  } = proxy
  return await fetch(target + encodeURIComponent(url), {
    headers,
    signal,
  })
}

export default async (url, options = {}) => {
  const {
    headers = {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    },
    proxy = null,
    agent = null,
    signal = null,
  } = options

  const res = proxy ? await profetch(url, { proxy, signal }) : await fetch(url, { headers, agent, signal })

  const status = res.status
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`)
  }
  const text = await res.text()
  return text.trim()
}
