// utils -> removeUTM

const removeUTM = (url) => {
  if (url.includes('#')) {
    let a1 = url.split('#');
    url = a1[0];
  }
  let arr = url.split('?');
  if (arr.length > 1) {
    let s = arr[1];
    return [arr[0], s.split('&').filter((v) => {
      return !(/^utm_/).test(v) && !(/^pk_/).test(v);
    }).join('&')].join('?');
  }
  return url;
};

module.exports = removeUTM;
