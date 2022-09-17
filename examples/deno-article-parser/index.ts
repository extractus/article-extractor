import { opine } from 'https://deno.land/x/opine@2.3.3/mod.ts'
import { extract } from 'https://esm.sh/article-parser@7.2.0-rc5'

const app = opine()

app.get('/', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.json({
      service: 'article-parser',
      lang: 'typescript',
      server: 'opine',
      platform: 'deno'
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

app.listen({ port: 3101 })
