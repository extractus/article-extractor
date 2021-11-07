// utils -> removeUTM

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
  'pk_campaign'
]

module.exports = (url) => {
  try {
    const pureUrl = new URL(url)

    blacklistKeys.forEach((key) => {
      pureUrl.searchParams.delete(key)
    })

    return pureUrl.toString().replace(pureUrl.hash, '')
  } catch (err) {
    return null
  }
}
