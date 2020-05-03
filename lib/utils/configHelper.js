const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const getRootPath = require("./getRootPath");
const getInnerConfig = require("./getInnerConfig");
const getInnerOptions = require("../utils/getInnerOptions");

function writeJSONSync(filePath, data, format = true) {
  const result = format ? prettier.format(JSON.stringify(data, null, "\t"), {
    parser: "json"
  }) : data;
  return fs.writeFileSync(filePath, result, { encoding: "UTF-8" });
}

function getProjectPageConfig(options) {
  const rootPath = getRootPath();
  const name = getInnerConfig("pageConfigFileName");
  const configPath = path.resolve(rootPath, name);
  if (!fs.existsSync(configPath)) {
    return {
      analzer: {}
    };
  }
  const pageConfig = require(configPath);
  return typeof pageConfig === "function" ? pageConfig({ ...getInnerOptions(), ...options }) : pageConfig;
}



module.exports = {
  writeJSONSync,
  getProjectPageConfig
};
