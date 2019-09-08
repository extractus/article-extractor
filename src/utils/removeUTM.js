// utils -> removeUTM

const removeUTM = (url) => {
  if (url.includes('#')) {
    const a1 = url.split('#');
    url = a1[0];
  }
  const arr = url.split('?');
  if (arr.length > 1) {
    const s = arr[1];
    return [arr[0], s.split('&').filter((v) => {
      return !(/^utm_/).test(v) && !(/^pk_/).test(v);
    }).join('&')].join('?');
  }
  return url;
};

module.exports = removeUTM;
