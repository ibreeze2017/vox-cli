const copy = require("copy");
const fs = require("fs");
const path = require("path");
const Logger = require("./Logger");
const toPascal = require("./checkUtil").toPascal;
const { getTemplatePath } = require("./pathUtil");
const { parse } = require("./parse");
const { getInnerPath, getJoinPath, getRootPath } = require("./pathUtil");
const { writeFileSync, mkdirsSync } = require("./fileUtil");
const { copyFileSync } = require("fs");
const getProjectConfig = require("../utils/getProjectConfig");

function createInitPage(pageName, options) {
  const { devBase, devLang, styleLang } = options;
  const isReact = devBase === "React";
  const isTs = devLang === "TypeScript";
  const folder = isTs ? "ts" : "js";
  let suffix = "less";
  switch (styleLang.toLowerCase()) {
    case "less":
      suffix = "less";
      break;
    case "sass":
      suffix = "scss";
      break;
    case "stylus":
      suffix = "styl";
      break;
    case "css":
      suffix = "css";
      break;
  }
  const valueMap = { suffix };
  const distStylePath = path.resolve(process.cwd(), `src/pages/${pageName}`);
  if (isReact) {
    writeFileSync(distStylePath, `App.${suffix}`, buildTemplate("style/app.tpl", valueMap));
    const indexPagePath2 = path.resolve(process.cwd(), `src/pages/${pageName}`);
    const srcPagePath2 = folder + "/" + (`react.app.${folder}.tpl`);
    writeFileSync(indexPagePath2, `${(!isTs ? "App.js" : "App.tsx")}`, buildTemplate(srcPagePath2, valueMap));
    const indexPagePath = path.resolve(process.cwd(), `src/pages/${pageName}/index.${folder}`);
    const srcPagePath = path.resolve(__dirname, getRootPath("boilerplates/_tpl"), folder + "/" + (`react.index.${folder}.tpl`));
    copyFileSync(srcPagePath, indexPagePath);
  } else {
    writeFileSync(distStylePath, `index.${suffix}`, buildTemplate("style/app.tpl", valueMap));
    const indexPagePath = path.resolve(process.cwd(), `src/pages/${pageName}`);
    const srcPagePath2 = folder + "/" + (`index.${folder}.tpl`);
    writeFileSync(indexPagePath, `${(!isTs ? "index.js" : "index.ts")}`, buildTemplate(srcPagePath2, valueMap));
  }
}

function getOptions() {
  const config = getProjectConfig();
  const { type, language } = config;
  const [devBase, devLang, styleLang] = language;
  return {
    devBase,
    devLang,
    styleLang,
    tpl: type
  };
}

function createPage(name) {
  const pagePath = getInnerPath().pages;
  const options = getOptions();
  const { tpl = "default" } = options;
  const distPagePath = getJoinPath(pagePath, name);
  if (fs.existsSync(distPagePath)) {
    Logger.error("create failed, page exists !");
    return;
  }
  copy(getRootPath(`boilerplates/${tpl}/src/pages/index`) + "/**", distPagePath, function(error, files) {
    if (error) {
      throw error;
    }
    createInitPage(name, options);
    Logger.success(`create success！page ${name}`);
  });
}

/**
 * 解析模板文件
 * @param fileName  模板文件名
 * @param valueMap 变量集合
 * @returns {string}
 */
function buildTemplate(fileName, valueMap) {
  const filePath = getTemplatePath(`_tpl/${fileName}`);
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  return parse(data, valueMap);
}

/**
 * 创建组件
 * @param compName
 */
function createComponent(compName) {
  const options = getOptions();
  const { devBase, devLang, styleLang } = options;
  const isReact = devBase === "React";
  if (!isReact) {
    Logger.info("This can only be used in react!");
    return;
  }
  const isTs = devLang === "TypeScript";
  const folder = isTs ? "ts" : "js";
  let suffix = "less";
  switch (styleLang.toLowerCase()) {
    case "less":
      suffix = "less";
      break;
    case "sass":
      suffix = "styl";
      break;
    case "stylus":
      suffix = "styl";
      break;
    case "css":
      suffix = "css";
      break;
  }
  const componentName = toPascal(compName);
  const componentPath = path.resolve(getInnerPath().components, compName);
  if (fs.existsSync(componentPath)) {
    Logger.error(`Create failed, component ${compName} exists!`);
    return;
  }
  mkdirsSync(componentPath);
  const stylePath = getJoinPath(componentPath, "style");
  const assetPath = getJoinPath(componentPath, "assets");
  mkdirsSync(assetPath);
  mkdirsSync(stylePath);
  const valueMap = { componentName, suffix };
  writeFileSync(stylePath, `index.${suffix}`, "");
  writeFileSync(stylePath, `index.${isTs ? "tsx" : "js"}`, buildTemplate(folder + "/react.component.style.index.tpl", valueMap));
  if (isTs) {
    writeFileSync(componentPath, `${componentName}.tsx`, buildTemplate(folder + "/react.component.tpl", valueMap));
    writeFileSync(componentPath, "index.tsx", buildTemplate(folder + "/react.component.index.tpl", valueMap));
  } else {
    writeFileSync(componentPath, `${componentName}.js`, buildTemplate(folder + "/react.component.tpl", valueMap));
    writeFileSync(componentPath, `index.js`, buildTemplate(folder + "/react.component.index.tpl", valueMap));
    writeFileSync(componentPath, "index.d.ts", buildTemplate(folder + "/d.ts.tpl", valueMap));
  }

  Logger.success(`create success, component ${componentName}!`);
}

/**
 * 创建 model
 * @param modelName
 * @param option
 */
function createModel(modelName, option) {
  const { ownPage = "" } = option;
  const pagePath = getInnerPath().pages;
  const modelPath = getJoinPath(pagePath, ownPage, "models");
  const valueMap = {
    namespace: modelName
  };
  writeFileSync(modelPath, `${modelName}.js`, buildTemplate("model.js.tpl", valueMap));
}

/**
 * 创建 Service
 * @param serviceName  服务文件名
 * @param option    是否为公用服务
 */
function createService(serviceName, option = {}) {
  const { ownPage = "" } = option;
  const pagePath = getInnerPath().pages;
  const servicePath = getInnerPath().services;
  const privatePath = getJoinPath(pagePath, ownPage, "service");
  writeFileSync(!ownPage ? servicePath : privatePath, `${serviceName}.js`, "");

}

module.exports = {
  createPage,
  createComponent,
  createService,
  createModel,
  createInitPage
};
