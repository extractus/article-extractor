// utils -> isValidURL

const fetch = require('node-fetch');

const {error} = require('./logger');
const {getNodeFetchOptions} = require('../config');

module.exports = async (url = '') => {
  try {
    const opts = getNodeFetchOptions();
    opts.method = 'HEAD';
    const res = await fetch(url, opts);
    return res.status === 200;
  } catch (err) {
    error(err);
    return false;
  }
};
