function flatObject(obj) {
  if (!obj || typeof obj !== "object") {
    return {};
  }
  Object.keys(obj).map(key => {
    const item = obj[key];
    if (typeof item === "object") {
      obj[key] = JSON.stringify(item);
    }
  });
  return obj;
}

function setConfig(obj, key, value) {
  let keyPath = key.split(".");
  let temp = obj;
  do {
    const keyItem = keyPath.shift();
    if (!temp[keyItem]) {
      temp[keyItem] = {};
    }
    temp = temp[keyItem];
  } while (keyPath.length > 1);
  const keyItem = keyPath.shift();
  temp[keyItem] = value;
  return obj;
}

function getConfig(obj, key) {
  let temp = Object.assign({}, obj);
  if (!key) {
    return temp;
  }
  const keyPath = key.split(".");
  let result;
  do {
    const keyItem = keyPath.shift();
    result = temp[keyItem];
    temp = result;
  } while (keyPath.length);
  return result;
}

module.exports = {
  setConfig,
  getConfig,
  flatObject
};
