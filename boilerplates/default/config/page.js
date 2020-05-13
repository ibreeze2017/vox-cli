module.exports = {
  inject: {},
  page: {
    name: 'index',
    title: '微风文档',
    filename: `index.html`,
  },
  dll: [
    {
      name: 'bundle',
      entry: [
        'react',
        'react-dom',
        'react-router',
        'react-redux',
        'redux-saga',
        'react-router-dom',
        'highlight.js',
        'marked',
        'axios',
        'for-editor',
        'crypto-js',
      ],
    },
  ],
};
