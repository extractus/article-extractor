// eval.js

import { readFileSync, writeFileSync, existsSync } from 'fs'

import { isValid as isValidUrl } from './src/utils/linker.js'
import { extract } from './src/main.js'

const extractFromUrl = async (url) => {
  try {
    const art = await extract(url)
    console.log(art)
    writeFileSync('output3.html', art.content, 'utf-8')
  } catch (err) {
    console.trace(err)
  }
}

const extractFromFile = async (fpath) => {
  try {
    const html = readFileSync(fpath, 'utf8')
    const art = await extract(html)
    console.log(art)
  } catch (err) {
    console.trace(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const input = argv[2]
    const isUrl = isValidUrl(input)
    return isUrl ? extractFromUrl(input) : existsSync(input) ? extractFromFile(input) : false
  }
  return 'Nothing to do!'
}

init(process.argv)
