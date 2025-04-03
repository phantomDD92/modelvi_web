const moment = require("moment");
const { VIP_PRICE_PLANS, NORMAL_PRICE_PLANS } = require("./const");

function getPricePlan(agency, revenue) {
  const pricePlans = agency.vip ? VIP_PRICE_PLANS : NORMAL_PRICE_PLANS;
  for (var i = 0; i < pricePlans.length; i++) {
    if (revenue < pricePlans[i].revenue)
      return pricePlans[i].price;
  }
  return pricePlans[pricePlans.length - 1].price;
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