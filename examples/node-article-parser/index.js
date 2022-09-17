import express from 'express'
import { extract } from 'article-parser'

const app = express()

app.get('/', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.json({
      service: 'article-parser',
      lang: 'javascript',
      server: 'express',
      platform: 'node'
    })
  }
  try {
    const data = await extract(url)
    return res.json({
      error: 0,
      message: 'article has been extracted successfully',
      data
    })
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
      data: null
    })
  }
})

app.listen(3102)
