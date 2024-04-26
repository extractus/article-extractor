// utils -> linker

import { DOMParser } from 'linkedom'

import { findBestMatch } from './similarity.js'

export const isValid = (url = '') => {
  try {
    const ourl = new URL(url)
    return ourl !== null && ourl.protocol.startsWith('http')
  } catch {
    return false
  }
}

export const chooseBestUrl = (candidates = [], title = '') => {
  const ranking = findBestMatch(title, candidates)
  return ranking.bestMatch.target
}

export const absolutify = (fullUrl = '', relativeUrl = '') => {
  try {
    const result = new URL(relativeUrl, fullUrl)
    return result.toString()
  } catch {
    return ''
  }
}

const blacklistKeys = [
  'CNDID',
  '__twitter_impression',
  '_hsenc',
  '_openstat',
  'action_object_map',
  'action_ref_map',
  'action_type_map',
  'amp',
  'fb_action_ids',
  'fb_action_types',
  'fb_ref',
  'fb_source',
  'fbclid',
  'ga_campaign',
  'ga_content',
  'ga_medium',
  'ga_place',
  'ga_source',
  'ga_term',
  'gs_l',
  'hmb_campaign',
  'hmb_medium',
  'hmb_source',
  'mbid',
  'mc_cid',
  'mc_eid',
  'mkt_tok',
  'referrer',
  'spJobID',
  'spMailingID',
  'spReportId',
  'spUserID',
  'utm_brand',
  'utm_campaign',
  'utm_cid',
  'utm_content',
  'utm_int',
  'utm_mailing',
  'utm_medium',
  'utm_name',
  'utm_place',
  'utm_pubreferrer',
  'utm_reader',
  'utm_social',
  'utm_source',
  'utm_swu',
  'utm_term',
  'utm_userid',
  'utm_viz_id',
  'wt_mc_o',
  'yclid',
  'WT.mc_id',
  'WT.mc_ev',
  'WT.srch',
  'pk_source',
  'pk_medium',
  'pk_campaign',
]

export const purify = (url) => {
  try {
    const pureUrl = new URL(url)

    blacklistKeys.forEach((key) => {
      pureUrl.searchParams.delete(key)
    })

    return pureUrl.toString().replace(pureUrl.hash, '')
  } catch {
    return null
  }
}

/**
 * @param inputHtml {string}
 * @param url {string}
 * @returns article {string}
 */
export const normalize = (html, url) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')

  Array.from(doc.getElementsByTagName('a')).forEach((element) => {
    const href = element.getAttribute('href')
    if (href) {
      element.setAttribute('href', absolutify(url, href))
      element.setAttribute('target', '_blank')
    }
  })

  Array.from(doc.getElementsByTagName('img')).forEach((element) => {
    const src = element.getAttribute('data-src') ?? element.getAttribute('src')
    if (src) {
      element.setAttribute('src', absolutify(url, src))
    }
  })

  return Array.from(doc.childNodes).map(element => element.outerHTML).join('')
}

export const getDomain = (url) => {
  const host = (new URL(url)).host
  return host.replace('www.', '')
}
