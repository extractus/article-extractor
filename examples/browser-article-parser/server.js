// server

import got from 'got'
import express from 'express'

const app = express()

const loadRemotePage = async (url) => {
  try {
    const headers = {
      'Accept-Charset': 'utf-8'
    }
    const data = await got(url, { headers }).text()
    return data
  } catch (err) {
    return err.message
  }
}

app.get('/proxy/gethtml', async (req, res) => {
  const url = req.query.url
  const xml = await loadRemotePage(url)
  return res.send(xml)
})

app.use(express.static('public'))

app.listen(3100, () => {
  console.log('Server is running at http://localhost:3100')
})
