const getProjectConfig = require("./getProjectConfig");
const cache = require("../utils/cache");

module.exports = function getInnerOptions(options) {
  return {
    cache,
    config: getProjectConfig(),
    ...options
  };
};
