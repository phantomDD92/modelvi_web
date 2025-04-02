const moment = require("moment");

function getPricePlan(revenue) {
  if (revenue < 1000)
    return 50;
  else if (revenue < 2500)
    return 75;
  else if (revenue < 5000)
    return 100;
  else if (revenue < 7500)
    return 150;
  else if (revenue < 10000)
    return 175;
  else if (revenue < 15000)
    return 200;
  else if (revenue < 20000)
    return 225;
  return 250;
}

function getDateDelta(date) {
  return date ? moment(date).diff(moment(), "day") : 0;
}

function hasSufficientBalance(agency, price) {
  return ((agency.balance || 0) >= price)
}

module.exports = {
  getPricePlan,
  getDateDelta,
  hasSufficientBalance
}