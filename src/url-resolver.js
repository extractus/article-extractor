/**
 * url-resolver
 * @ndaidong
 **/

'use strict';

var URL = require('url');

var config = require('./config');

var isInBlackList = (url) => {

  let arr = config.blackList;

  let yes = false;
  for(let i = 0; i < arr.length; i++){
    let str = arr[i];
    if(url.includes(str)){
      yes = true;
      break;
    }
  }
  return yes;
}

var isAdsDomain = (url) => {

  let arr = config.adsDomain;

  let yes = false;
  for(let i = 0; i < arr.length; i++){
    if(url.includes(arr[i]) > 0){
      yes = true;
      break;
    }
  }
  return yes;
}

var isValidURL = (str) => {
  if(str.match(/t\.co\/(\w)*\./gi)){
    return false;
  }
  if(isInBlackList(str)){
    return false;
  }
  let pattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?$', 'i');
  if(!pattern.test(str)){
    return false;
  }
  return true;
}

var removeUTM = (url) => {
  if(url.includes('#')){
    let a1 = url.split('#');
    url = a1[0];
  }
  let arr = url.split('?');
  if(arr.length > 1){
    let s = arr[1];
    return [arr[0], s.split('&').filter((v) => {
      return !/^utm_/.test(v) && !/^pk_/.test(v);
    }).join('&')].join('?');
  }
  return url;
}

var purifyURL = (url) => {
  if(!isValidURL(url)){
    return false;
  }
  url = removeUTM(url);
  let g = URL.parse(url);
  let u = [g.protocol, '//', g.host, g.pathname].join('');
  if(isAdsDomain(url) || !g.search || g.search.indexOf('=') === -1){
    return u;
  }
  return u + g.search;
}

var getDomain = (url) => {
  let g = URL.parse(url);
  return g.host;
}

module.exports = {
  purifyURL: purifyURL,
  getDomain: getDomain
}
