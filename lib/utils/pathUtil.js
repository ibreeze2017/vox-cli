const path = require('path');
const fs = require('fs');

function getCurrentPath(filePath = '') {
  return path.join(process.cwd(), filePath);
}

function getJoinPath(...args) {
  return path.join(...args);
}

function getInnerPath() {
  return {
    'public': getCurrentPath('public'),
    'typings': getCurrentPath('typings'),
    common: getCurrentPath('src/common'),
    pages: getCurrentPath('src/pages'),
    shared: getCurrentPath('src/shared'),
    components: getCurrentPath('src/shared/components'),
  };
}

function existsSync(dir) {
  return fs.existsSync(dir);
}

function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }
  if (fs.statSync(dir).isDirectory()) {
    return fs.readdirSync(dir).length === 0;
  }
  return true;
}

function getRootPath(param = '') {
  return path.resolve(__dirname, '../../', param);
}

function getTemplatePath(param = '') {
  return getRootPath('boilerplates/' + param);
}


module.exports = {
  getCurrentPath,
  getInnerPath,
  getRootPath,
  getTemplatePath,
  getJoinPath,
  existsSync,
  isDirEmpty,
};