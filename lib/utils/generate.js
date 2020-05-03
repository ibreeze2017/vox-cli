const copy = require("copy");
const path = require("path");
const Logger = require('./Logger');

function generate(dir) {
  const distDir = path.resolve(process.cwd(), dir);
  Logger.log("%s", distDir);
  copy(
    path.resolve(__dirname, "../../boilerplates/app") + "/**",
    distDir,
    function (error, files) {
      if (error) {
        throw error;
      }
      // files.forEach(file => {
      //   console.log(file.path);
      // })
    }
  );
}

module.exports = function (program) {
  const args = program.args;
  const dir = args.length ? args[0] : "demo";
//   generate(dir);
};
