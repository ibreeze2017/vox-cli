#!/usr/bin/env node

const { getProjectPath } = require("../lib/utils/helper");
const program = require("commander");
const packageInfo = require(getProjectPath("package.json"));
program
  .version(packageInfo.version)
  .option("-i, --init", "init a tex base project")
  .option("-d, --dependencies", "init with dependencies")
  .option("-gen, --generate", "generate a new page, include all config")
  .option("-p, --page [pageName]")
  .option("-s, --skip", "use default config")
  .option("-f, --force", "override if directory exists", false)
  .option("-m, --mode", "execute mode", "build")
  .option("--skip", "use default config")
  .option("-t, --tpl [tpl]", "select template", "default")
  .option("--less", "use less")
  .option("--sass", "use sass")
  .option("--stylus", "use stylus")
  .option("--ts", "use typescript")
  .option("--js", "use react")
  .option("--es", "use es to develop")
  .option("--react", "use react")
  .option("--ejs", "user ejs template", true)
  .parse(process.argv);

const { args, skip, less, sass, stylus, ts, es, ejs, js, react, force, tpl, mode } = program;
const developOptions = { skip, less, sass, js, ejs, stylus, ts, es, react, force, tpl, mode };

const cache = require("../lib/utils/cache");
cache.set("options", developOptions);


// 初始化
if (program.init) {
  const [name = null, ...restArgs] = args;
  init(name, restArgs, developOptions);
  return;
}

if (program.generate) {
  const [name = null, ...restArgs] = args;
  gen(name, restArgs);
  return;
}


if (args.length) {
  const [_, ...restArgs] = args;
  if (_.toLowerCase() === "new") {
    const [name = null, ...options] = restArgs;
    init(name, options, developOptions);
  } else if (["start", "dll", "build", "deploy", "ans"].includes(_.toLowerCase())) {
    const getProjectConfig = require("../lib/utils/getProjectConfig");
    const pageConfig = typeof getProjectConfig === "function" ? getProjectConfig(developOptions) : getProjectConfig;
    cache.set("config.page", pageConfig);
    require(`../lib/scripts/${_}`)(pageConfig);
  } else {
    gen(_, restArgs);
  }
}


function init(name, restArgs, developOptions) {
  require("../lib/utils/banner");
  require("../lib/scripts/init")(program, name, restArgs, developOptions);
}

function gen(name, restArgs) {
  require("../lib/scripts/gen")(program, name, restArgs);
}
