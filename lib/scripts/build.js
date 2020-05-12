const webpack = require("webpack");
const Logger = require("../utils/Logger");
const cache = require("../utils/cache");
const getWebpackConfig = require("../config/getWebpackConfig");

module.exports = function (options = {}) {
  const config = getWebpackConfig({
    ...options
  });
  webpack(config, (err, stats) => {
    if (err) {
      Logger.error(err);
    }
    if (stats && stats.hasErrors()) {
      Logger.error(stats.toString("minimal"));
    }
    if (stats && stats.hasWarnings()) {
      // 在这里处理错误
      Logger.warn(stats.toString("minimal"));
    }
    // 处理完成
    Logger.log(stats.toString({
      assets: true,
      chunks: false,
      // 添加 namedChunkGroups 信息
      chunkGroups: false,
      // 将构建模块信息添加到 chunk 信息
      chunkModules: false,
      // 添加 chunk 和 chunk merge 来源的信息
      chunkOrigins: false,
      // 添加构建模块信息
      modules: false,
      colors: true,
      reasons: false,
      children: false
    }));
  });
};
