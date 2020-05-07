// utils/extractWithReadability

const {extract} = require('oembed-parser');

const {
  error,
} = require('../utils/logger');

module.exports = async (url) => {
  try {
    const oembed = await extract(url);
    return oembed;
  } catch (err) {
    error(err);
    return null;
  }
};
