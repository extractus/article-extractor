# browser-article-parser

This demo shows how to use `article-parser` at client side, with or without proxy.

To install:

```bash
npm i

# or pnpm, yarn
```

Start server:

```bash
npm start
```

Open `http://localhost:3100/` to test.

Basically `article-parser` only works at server side.

However there are some noble publishers those enable `Access-Control-Allow-Origin` on their service.
For example with articles from [bitcoin.com](https://news.bitcoin.com/the-future-of-nft-is-evt-the-new-game-changer-token/), [CNBC](https://www.cnbc.com/2022/09/21/what-another-major-rate-hike-by-the-federal-reserve-means-to-you.html) or [Decrypt](https://decrypt.co/110356/cardano-blockchain-moves-forward-with-vasil-upgrade) we can extract from browser.

With the remaining cases, we need a proxy layer to bypass CORS policy.

---
