// utils -> toSecond

const toSecond = (duration) => {
  let matches = duration.match(/[0-9]+[HMS]/g);

  let seconds = 0;

  matches.forEach((part) => {
    let unit = part.charAt(part.length - 1);
    let amount = parseInt(part.slice(0, -1), 10);

    switch (unit) {
      case 'H':
        seconds += amount * 60 * 60;
        break;
      case 'M':
        seconds += amount * 60;
        break;
      case 'S':
        seconds += amount;
        break;
      default:
    }
  });

  return seconds;
};

module.exports = toSecond;
