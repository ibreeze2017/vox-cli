const config = require("../config/tex.config");
const { getConfig } = require("./util");

/**
 * 获取内部配置
 * @param key
 * @return {*}
 */
module.exports = function getInnerConfig(key) {
  return getConfig(config, key);
};

