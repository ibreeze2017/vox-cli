const fs = require('fs');
const path = require('path');
const getInnerConfig = require('./getInnerConfig');

/**
 * 检测项目配置
 * @returns {boolean}
 */
function checkIsValidProject() {
  const currentPath = process.cwd();
  // 检测配置文件
  const configFileName = getInnerConfig('configFileName');
  const configFilePath = path.join(currentPath, configFileName);
  return fs.existsSync(configFilePath);
}

function toPascal(str) {
  const strArr = str.split('-');
  for (let i = 1; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  const res = strArr.join('');
  return res[0].toUpperCase() + res.substr(1);
}

module.exports = {
  checkIsValidProject,
  toPascal,
};
