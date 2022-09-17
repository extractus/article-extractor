import { Hono } from 'hono'

import { extract } from 'article-parser'

const app = new Hono()
app.get('/', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json({
      service: 'article-parser',
      lang: 'typescript',
      server: 'hono',
      platform: 'bun'
    })
  }
  try {
    const data = await extract(url)
    return c.json({
      error: 0,
      message: 'article has been extracted successfully',
      data
    })
  } catch (err) {
    return c.json({
      error: 1,
      message: err.message,
      data: null
    })
  }
})

export default {
  port: 3100,
  fetch: app.fetch,
}
