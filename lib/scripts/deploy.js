const fs = require('fs');
const path = require('path');
const unzip = require('unzip2');
const archiver = require('archiver');
const request = require('request');

const apiUrl = 'http://localhost:3000';


function upload(url, filepath, callback) {
  const req = request.post(apiUrl + url, (err, resp, body) => {
    if (err) {
      console.log('Error:' + err);
    } else {
      console.log('URL: ' + body);
    }
  });

  const form = req.form();
  Object.entries(getPackageInfo()).forEach(([key, value]) => {
    form.append(key, value);
  });
  form.append('file', fs.createReadStream(filepath));
}

function getPackageInfo() {
  const pkg = require(path.resolve(process.cwd(), './package.json'));
  const { version, description, name } = pkg;
  return {
    version,
    name,
    description,
  };
}

/**
 * 压缩Zip
 * @param dir
 * @param filePath
 * @param cb
 */
function toZip(dir, filePath, cb) {
  const output = fs.createWriteStream(filePath);
  const archive = archiver('zip');
  archive.on('error', (err) => {
    console.log(err);
  });
  archive.on('end', (err) => {
    cb && cb(filePath);
  });
  archive.pipe(output);
  archive.directory(dir, 'dist');
  archive.finalize();
}


function toUnzip(src, to) {
  return fs.createReadStream(src).pipe(unzip.Extract({ path: to }));
}

function getWorkPath() {
  return process.cwd();
}

module.exports = function deploy(options) {
  const rootPath = getWorkPath();
  // 压缩部署
  toZip(path.resolve(rootPath, 'dist'), path.resolve(rootPath, '.deploy/dist.zip'), (path) => {
    upload('/api/deploy', path);
  });
};
