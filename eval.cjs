// eval.js
// to quickly test with a single url or file

const { extract } = require('./dist/cjs/article-parser.js')

const extractFromUrl = async (url) => {
  try {
    const art = await extract(url)
    console.log(art)
  } catch (err) {
    console.trace(err)
  }
}

const init = (argv) => {
  if (argv.length === 3) {
    const input = argv[2]
    return extractFromUrl(input)
  }
  return 'Nothing to do!'
}

init(process.argv)
