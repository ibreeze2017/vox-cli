const fs = require('fs');
const path = require('path');
const getRootPath = require('../utils/getRootPath');
const getInnerConfig = require('../utils/getInnerConfig');
const {getProjectPath} = require('../utils/helper');

module.exports = function getProjectConfig() {
  const rootPath = getRootPath();
  const name = getInnerConfig('pageConfigFileName');
  const configPath = getProjectPath(name);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found ${name}`);
  }
  return require(configPath);
};
