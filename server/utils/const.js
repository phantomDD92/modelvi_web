const NORMAL_PRICE_PLANS = [
  { revenue: 1000.00, price: 50.00 },
  { revenue: 2500.00, price: 75.00 },
  { revenue: 5000.00, price: 100.00 },
  { revenue: 7500.00, price: 150.00 },
  { revenue: 10000.00, price: 175.00 },
  { revenue: 15000.00, price: 200.00 },
  { revenue: 20000.00, price: 225.00 },
  { revenue: 1000000.00, price: 250.00 },
];

const VIP_PRICE_PLANS = [
  { revenue: 1000.00, price: 50.00 },
  { revenue: 2500.00, price: 75.00 },
  { revenue: 5000.00, price: 80.00 },
  { revenue: 7500.00, price: 120.00 },
  { revenue: 10000.00, price: 140.00 },
  { revenue: 15000.00, price: 160.00 },
  { revenue: 20000.00, price: 180.00 },
  { revenue: 1000000.00, price: 200.00 },
];

module.exports = {
  DEFAULT_COMMENT_INTERVAL: 30,
  DEFAULT_FOLLOW_INTERVAL: 30,
  DEFAULT_CHAT_INTERVAL: 10,

  DEFAULT_STORY_INTERVAL: 30,
  DEFAULT_STORY_OFFSETS: [1, 21, 51],

  DEFAULT_POST_INTERVAL: 60,
  DEFAULT_POST_OFFSETS: [1, 21, 51],

  NORMAL_PRICE_PLANS,
  VIP_PRICE_PLANS,
};