import { serve } from 'https://deno.land/std/http/server.ts'

import { Hono } from 'https://deno.land/x/hono@v2.1.4/mod.ts'

// for deno > 1.28 only
import { extract } from 'npm:@extractus/article-extractor'

// for deno < 1.28
// import { extract } from 'https://esm.sh/@extractus/article-extractor'

const app = new Hono()

const meta = {
  service: 'article-parser',
  lang: 'typescript',
  server: 'hono',
  platform: 'deno'
}

app.get('/', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json(meta)
  }
  try {
    const data = await extract(url)
    return c.json({
      error: 0,
      message: 'article has been extracted successfully',
      data,
      meta
    })
  } catch (err) {
    return c.json({
      error: 1,
      message: err.message,
      data: null,
      meta
    })
  }
})

serve(app.fetch, {
  port: 3100,
  onListen: () => {
    console.log('Server is running at http://localhost:3100')
  }
})
