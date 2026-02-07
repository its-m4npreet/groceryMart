const stockService = require('./stockService');
const orderService = require('./orderService');
const analyticsService = require('./analyticsService');

module.exports = {
  ...stockService,
  ...orderService,
  ...analyticsService,
};
