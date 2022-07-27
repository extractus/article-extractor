// utils -> retrieve

import axios from 'axios'

import { getRequestOptions } from '../config.js'

export default async (url) => {
  try {
    const res = await axios.get(url, getRequestOptions())

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Content type must be "text/html", not "${contentType}"`)
    }
    return res.data
  } catch (err) {
    throw new Error(`${err.name}: ${err.message}`)
  }
}
