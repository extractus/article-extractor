
/**
 * Convert date format to YYYY-MM-DD
 *
 * @param {string} dateString
 * @returns {string} YYYY-MM-DD
 */
function convertDateFormat (dateString) {
  const parts = dateString.split('/')
  if (parts.length !== 3) return dateString

  let year, month, day

  if (parseInt(parts[0]) > 12) {
    [day, month, year] = parts
  } else {
    [month, day, year] = parts
  }

  year = year.length === 2 ? '20' + year : year
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`
}

/**
 * Look for the publication date in the body of the content.
 *
 * @param {Document} document - The HTML Document
 * @returns {string} The date string
 */
export default function (doc) {
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/,
    /\d{1,2}\/\d{1,2}\/\d{2,4}/,
  ]

  const findDate = (element) => {
    for (const pattern of datePatterns) {
      const match = element.textContent.match(pattern)
      if (match) return convertDateFormat(match[0])
    }
    return ''
  }

  const priorityElements = doc.querySelectorAll('time, [datetime], [itemprop~=datePublished], [itemprop~=dateCreated]')
  for (const el of priorityElements) {
    const date = el.getAttribute('datetime') || el.getAttribute('content') || findDate(el)
    if (date) return date
  }

  const secondaryElements = doc.querySelectorAll('p, span, div')
  for (const el of secondaryElements) {
    const date = findDate(el)
    if (date) return date
  }

  return ''
}
