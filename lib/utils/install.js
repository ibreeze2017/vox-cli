const which = require("which");

function runCmd(cmd, args, fn) {
  args = args || [];
  const runner = require("child_process").spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on("close", function (code) {
    if (fn) {
      fn(code);
    }
  });
}

function findNpm() {
  const npms = process.platform === "win32" ? ["tnpm.cmd", "cnpm.cmd", "npm.cmd"] : ["tnpm", "cnpm", "npm"];
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log("use npm: " + npms[i]);
      return npms[i];
    } catch (e) {
    }
  }
  throw new Error("please install npm");
}

function installDep(done) {
  const npm = findNpm();
  runCmd(which.sync(npm), ["install"], function () {
    runCmd(which.sync(npm), ["install", "vox-cli", "--save-dev"], function () {
      console.log(npm + " install end");
      done();
    });
  });
};

function install(done) {
  const npm = findNpm();
  runCmd(which.sync(npm), ["install"], function () {
    done();
  });
};
module.exports = {install, installDep};