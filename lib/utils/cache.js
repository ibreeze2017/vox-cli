const map = {};
const { setConfig, getConfig } = require("./util");

function cache() {
  return {
    set: (key, value) => {
      setConfig(map, key, value);
      return this;
    },
    get: (key, value, defaults) => {
      const v = getConfig(map, key, value);
      return typeof v === "undefined" ? defaults : v;
    },
    remove: (key) => {
      delete map[key];
      return this;
    },
    data: () => map
  };
};
module.exports = cache();
