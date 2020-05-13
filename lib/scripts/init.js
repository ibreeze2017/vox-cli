const {renameSync, copyFileSync, existsSync} = require("fs");
const copy = require("copy");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const {install, installDep} = require("../utils/install")
const getInnerConfig = require("../utils/getInnerConfig");
const {getCurrentPath, isDirEmpty} = require("../utils/pathUtil");
const Logger = require("../utils/Logger");
const {writeJSONSync} = require("../utils/configHelper");
const {createInitPage} = require("../utils/create");

function checkTemplate(tpl) {
  const tplPath = path.resolve(__dirname, `../../boilerplates/${tpl}`);
  return existsSync(tplPath);
}

function copyTemplate(dir, tpl = "default", callback) {
  if (!checkTemplate(tpl)) {
    Logger.error(`[ERROR]:Template ${tpl} doesn't exist!`);
    return;
  }
  const distDir = path.resolve(process.cwd(), dir);
  copy(
    path.resolve(__dirname, `../../boilerplates/${tpl}`) + "/**",
    distDir,
    function (error) {
      if (error) {
        throw error;
      }
      if (callback) {
        callback();
      }
    }
  );
}

function getAppDir(dir) {
  if (dir) {
    return Promise.resolve(dir);
  }
  return inquirer.prompt([
    {
      type: "input",
      message: "Please enter your project name:",
      name: "projectName",
      default: "demo",
      filter(value) {
        return value.replace(/[^\w\.-]/g, "");
      }
    }
  ]).then(answer => {
    return answer.projectName;
  });
}

function choseDevLang() {
  const promptList = [{
    type: "list",
    message: "Please select development Language:",
    name: "language",
    choices: [
      "TypeScript",
      "JavaScript"
    ]
  }];
  return inquirer.prompt(promptList).then(answer => {
    return answer.language;
  });
}

function choseDevCss() {
  const promptList = [
    {
      type: "list",
      message: "Please select development Style Language:",
      name: "styleLang",
      choices: [
        "Less",
        "Sass",
        "Stylus"
      ]
    }
  ];
  return inquirer.prompt(promptList).then(answer => {
    return answer.styleLang;
  });
}

function chooseDevBase() {
  const promptList = [
    {
      type: "list",
      message: "Please select development FEF:",
      name: "devBase",
      choices: [
        "React",
        "ES"
      ]
    }
  ];
  return inquirer.prompt(promptList).then(answer => {
    return answer.devBase;
  });
}

function init(projectName, developOptions) {
  // 检测目录是否为空
  const dstDir = path.join(getCurrentPath(projectName));
  const {force} = developOptions;
  if (!isDirEmpty(dstDir)) {
    if (force) {
      Logger.warn("override directory exist!");
    } else {
      const promptList = [
        {
          type: "confirm",
          message: chalk.yellow("Directory already exists and is not empty. Do you want to continue?"),
          name: "go",
          default: false,
          suffix: "[WARN]"
        }
      ];
      inquirer.prompt(promptList).then(result => {
        if (!result.go) {
          Logger.error("Create interruption!");
          return;
        }
        prepareBuild(projectName, dstDir, developOptions);
      });
      return;
    }
  }
  prepareBuild(projectName, dstDir, developOptions);
}

function simpleBuild(projectName, dstDir, developOptions) {
  const {tpl} = developOptions;
  Logger.info(`[Info]:Copy template files To ${dstDir}, use template ${tpl}!`);
  copyTemplate(projectName, tpl, () => {
    [
      'commitlintrc.js',
      'editorconfig',
      'eslintignore',
      'eslintrc.js',
      'gitattributes',
      'gitignore',
      'prettierrc.js',
      'stylelintignore',
      'stylelintrc.js',
    ].forEach(item => {
      if (existsSync(item)) {
        renameSync(item, `.${item}`);
      }
    });
    process.chdir(projectName);
    install(printSuccess);
  });
}

function prepareBuild(projectName, dstDir, developOptions) {
  if (developOptions.tpl === 'simple') {
    if(!existsSync(path.resolve(projectName))){

    }
    simpleBuild(projectName, dstDir, developOptions);
    return;
  }
  if (developOptions.skip) {
    create(projectName, dstDir, {
      devBase: "React",
      devLang: "TypeScript",
      styleLang: "Less",
      projectName
    }, developOptions);
    return;
  }
  const devBaseList = ["React", "ES"];
  const devLangList = ["TypeScript", "JavaScript"];
  const styleLangList = ["Less", "Sass", "Stylus"];

  const devBaseIndex = [developOptions.react, developOptions.es].findIndex(item => !!item);
  const devBasePromise = devBaseIndex > -1 ? Promise.resolve(devBaseList[devBaseIndex]) : chooseDevBase();
  return devBasePromise.then(devBase => {
    const devLangIndex = [developOptions.ts, developOptions.js].findIndex(item => !!item);
    const devLangPromise = devLangIndex > -1 ? Promise.resolve(devLangList[devLangIndex]) : choseDevLang();
    return devLangPromise.then(devLang => {
      const styleLangIndex = [developOptions.less, developOptions.sass, developOptions.stylus].findIndex(item => !!item);
      const styleLangPromise = styleLangIndex > -1 ? Promise.resolve(styleLangList[styleLangIndex]) : choseDevCss();
      return styleLangPromise.then(styleLang => {
        return {
          devBase, devLang, styleLang, projectName
        };
      }).then(res => {
        create(projectName, dstDir, res, developOptions);
        return res;
      });
    });
  });
}

function create(projectName, dstDir, res, developOptions) {
  const {tpl} = developOptions;
  Logger.info(`[Info]:Copy template files To ${dstDir}, use template ${tpl}!`);
  copyTemplate(projectName, tpl, () => {
    prepare(projectName, res, developOptions);
  });
}

function createPage(res) {
  const {devBase, devLang} = res;
  const isReact = devBase === "React";
  const isTs = devLang === "TypeScript";
  const folder = isTs ? "ts" : "js";
  const pageName = 'index';
  if (isReact) {
    const indexPagePath2 = path.resolve(process.cwd(), `src/pages/${pageName}/${(!isTs ? "App.js" : "App.tsx")}`);
    const srcPagePath2 = path.resolve(__dirname, "../../boilerplates/_tpl", folder + "/" + (`react.app.${folder}.tpl`));
    copyFileSync(srcPagePath2, indexPagePath2);

    const indexPagePath = path.resolve(process.cwd(), `src/pages/${pageName}/index.${folder}`);
    const srcPagePath = path.resolve(__dirname, "../../boilerplates/_tpl", folder + "/" + (`react.index.${folder}.tpl`));
    copyFileSync(srcPagePath, indexPagePath);
  } else {
    const indexPagePath = path.resolve(process.cwd(), `src/pages/${pageName}/${(!isTs ? "index.js" : "index.ts")}`);
    const srcPagePath = path.resolve(__dirname, "../../boilerplates/_tpl", folder + "/" + (`index.${folder}.tpl`));
    copyFileSync(srcPagePath, indexPagePath);
  }
}

function prepare(projectName, options, developOptions) {
  const {configFileName} = getInnerConfig();
  const filePath = path.resolve(process.cwd(), projectName, configFileName);
  const data = require(filePath);
  data.projectName = projectName;
  const {devBase, devLang, styleLang} = options;
  const {tpl} = developOptions;
  data.language = [devBase, devLang, styleLang];
  data.type = tpl;
  writeJSONSync(filePath, data);
  process.chdir(projectName);
  createInitPage("index", options);
  [
    'commitlintrc.js',
    'editorconfig',
    'eslintignore',
    'eslintrc.js',
    'gitattributes',
    'gitignore',
    'prettierrc.js',
    'stylelintignore',
    'stylelintrc.js',
  ].forEach(item => {
    if (existsSync(item)) {
      renameSync(item, `.${item}`);
    }
  });
  const packageInfoPath = path.resolve(process.cwd(), "package.json");
  const packageInfo = require(packageInfoPath);
  const map = {
    "ES": [[], []],
    "JavaScript": [[], []],
    "React": [["react,^16.12.0", "react-dom,^16.12.0"], ["@types/react,^16.9.17", "@types/react-dom,^16.9.4"]],
    "TypeScript": [[], []],
    "Less": [[], []],
    "Sass": [[], []],
    "Stylus": [[], []]
  };
  let depend = [];
  let devDepend = [];
  [devBase, devLang, styleLang].forEach(key => {
    if (!map[key]) {
      Logger.error(key);
      return;
    }
    const [d, e] = map[key];
    depend = depend.concat(d);
    devDepend = devDepend.concat(e);
  });
  devDepend.forEach(item => {
    const [name, version] = item.split(",");
    packageInfo.devDependencies[name] = version;
  });
  depend.forEach(item => {
    const [name, version] = item.split(",");
    packageInfo.dependencies[name] = version;
  });
  writeJSONSync(packageInfoPath, packageInfo);
  installDep(printSuccess);
}

function printSuccess() {
  Logger.success("Success !");
}

module.exports = function (program, name, restArgs, developOptions) {
  getAppDir(name)
    .then(projectName => {
      init(projectName, developOptions);
    });
};
