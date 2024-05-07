import puppeteer from 'puppeteer'
import express from 'express'
import { extractFromHtml } from '@extractus/article-extractor'

const app = express()

const meta = {
  service: 'article-parser-pupperteer',
  lang: 'javascript',
  server: 'express',
  platform: 'node',
}

const loadHtml = async (url) => {
  let browser = null
  try {
    console.log('Initialize puppeteer engine')
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(6e4)
    console.log(`Start rendering target page "${url}"`)
    await page.goto(url, {
      waitUntil: 'networkidle0',
    })
    console.log(`Load html content from target page ${url}`)
    const html = await page.content()
    return html
  } catch (err) {
    console.error(err)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

app.get('/', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.json(meta)
  }
  try {
    const html = await loadHtml(url)
    const data = await extractFromHtml(html, url)
    return res.json({
      error: 0,
      message: 'article has been extracted successfully',
      data,
      meta,
    })
  } catch (err) {
    return res.json({
      error: 1,
      message: err.message,
      data: null,
      meta,
    })
  }
})

app.listen(3100, () => {
  console.log('Server is running at http://localhost:3100')
})
