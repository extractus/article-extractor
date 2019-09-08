// utils -> getYtid

const getYtid = (lnk) => {
  const x1 = 'www.youtube.com/watch?';
  const x2 = 'youtu.be/';
  const x3 = 'www.youtube.com/v/';
  const x4 = 'www.youtube.com/embed/';
  let s = '';
  let vid = '';

  lnk = lnk.replace('http://', '');
  lnk = lnk.replace('https://', '');

  if (lnk.indexOf(x1) === 0) {
    s = lnk.replace(x1, '');
    const arr = s.split('&');
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const tm = arr[i].split('=');
        if (tm[0] === 'v') {
          vid = tm[1];
          break;
        }
      }
    }
  } else if (lnk.indexOf(x2) === 0) {
    vid = lnk.replace(x2, '');
  } else if (lnk.indexOf(x3) === 0) {
    vid = lnk.replace(x3, '');
  } else if (lnk.indexOf(x4) === 0) {
    vid = lnk.replace(x4, '');
    const ques = vid.indexOf('?');
    if (ques !== -1) {
      vid = vid.substring(0, ques);
    }
  }
  return vid;
};

module.exports = getYtid;
