function parse(content, valueMap = {}) {
  const reg = /%([a-zA-Z]\w*)%/g;
  let result;
  while ((result = reg.exec(content)) !== null) {
    const key = result[1];
    if (key && valueMap[key]) {
      content = content.replace(new RegExp(result[0], "g"), valueMap[key]);
    }
  }
  return content;
}


module.exports = {
  parse
};
