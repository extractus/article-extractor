// eval.js

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'

import { slugify } from 'bellajs'

import { isValid as isValidUrl } from './src/utils/linker.js'
import { extract } from './src/main.js'

if (!existsSync('evaluation')) {
  execSync('mkdir evaluation')
}

const extractFromUrl = async (url) => {
  try {
    console.time('extraction')
    const art = await extract(url)
    console.log(art)
    const slug = slugify(art.title)
    writeFileSync(`evaluation/${slug}.html`, art.content, 'utf8')
    console.timeEnd('extraction')
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
