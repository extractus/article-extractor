// utils -> retrieve

import axios from 'axios'

import logger from './logger.js'

import { getRequestOptions } from '../config.js'

export default async (url) => {
  try {
    const res = await axios.get(url, getRequestOptions())

    const contentType = res.headers['content-type'] || ''
    if (!contentType || !contentType.includes('text/html')) {
      logger.error(`Content type must be "text/html", not "${contentType}"`)
      return null
    }

    return res.data
  } catch (err) {
    logger.error(err.message || err)
    return null
  }
}
