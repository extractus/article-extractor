// utils / logger

import debug from 'debug'

const name = 'article-parser'

export const info = debug(`${name}:info`)
export const error = debug(`${name}:error`)
export const warning = debug(`${name}:warning`)

export default {
  info: debug(`${name}:info`),
  error: debug(`${name}:error`),
  warning: debug(`${name}:warning`)
}
