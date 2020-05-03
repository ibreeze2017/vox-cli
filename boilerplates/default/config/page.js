module.exports = {
  inject: {},
  page: {
    title: "微风文档",
    filename: `index.html`,
    template: `./src/pages/index.ejs`
  },
  dll: [
    {
      name: "bundle",
      entry: [
        "react",
        "react-dom",
        "react-router",
        "react-redux",
        "redux-saga",
        "react-router-dom",
        "highlight.js",
        "marked",
        "axios",
        "for-editor",
        "crypto-js"
      ]
    }
  ]
};
