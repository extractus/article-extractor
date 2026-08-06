// utils -> retrieve

/**
 * Fetch content from a URL using the provided fetcher function.
 *
 * @param {string} url - URL to fetch
 * @param {Function} fetcher - Custom fetch function (url) => Promise<Response>
 * @returns {Promise<ArrayBuffer>} Response body as ArrayBuffer
 */
export default async (url, fetcher) => {
  const res = await fetcher(url)

  const status = res.status
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`)
  }
  const buffer = await res.arrayBuffer()
  return buffer
}
