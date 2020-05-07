// utils -> isValidUrl

const {parse} = require('url');

const {
  isString,
} = require('bellajs');

module.exports = (url = '') => {
  if (!isString(url)) {
    return false;
  }
  const pros = ['http:', 'https:'];

  const {
    protocol,
    host,
    hostname,
  } = parse(url);

  return (!host || !hostname || !pros.includes(protocol)) ? false : true;
};
