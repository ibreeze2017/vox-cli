const fs = require('fs');
const path = require('path');

/**
 *  递归创建目录 同步方法
 * @param dirname
 * @returns {boolean}
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}


function writeFileSync($dir, $name, $content) {
  if (!fs.existsSync($dir)) {
    mkdirsSync($dir);
  }
  fs.writeFileSync($dir + '/' + $name, $content);
}

function readFileSync(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${filePath} 不存在 ！`);
  }
  return fs.readFileSync(filePath);
}

module.exports = {
  mkdirsSync,
  readFileSync,
  writeFileSync,
}
;
