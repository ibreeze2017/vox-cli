const fs = require('fs');
const path = require('path');
const getRootPath = require('../utils/getRootPath');
const getInnerConfig = require('../utils/getInnerConfig');

module.exports = function getProjectConfig() {
  const rootPath = getRootPath();
  const name = getInnerConfig('configFileName');
  const configPath = path.resolve(rootPath, name);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found ${name}`);
  }
  return require(configPath);
};