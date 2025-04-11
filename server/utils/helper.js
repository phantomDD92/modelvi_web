const moment = require("moment");
const crypto = require("crypto");
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

function generateReferralCode(length = 10) {
  // Define the character set to use
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Create a cryptographically strong random values array
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  // Build the string
  randomValues.forEach((value) => {
    result += chars[value % chars.length];
  });

  return result;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;
}

module.exports = {
  getPricePlan,
  getDateDelta,
  hasSufficientBalance,
  generateReferralCode,
  getClientIp,
}