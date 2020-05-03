const { resolve } = require('../utils/helper');
module.exports = function getBabelConfig() {

  return {
    plugins: [
      [
        resolve('@babel/plugin-transform-runtime'),
        {
          absoluteRuntime: false,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
        },
      ],
      [
        resolve('@babel/plugin-proposal-decorators'),
        {
          legacy: true,
        },
      ],
      [resolve('@babel/plugin-syntax-dynamic-import')],
      [
        resolve('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      [
        resolve('babel-plugin-import'),
        {
          libraryName: 'react-iaux',
          libraryDirectory: 'es',
          style: true,
          camel2DashComponentName: false,
          customName: (name) => {
            return `react-iaux/es/${[name[0].toLowerCase(), name.substr(1)].join('')}`;
          },
        },
      ],
    ],
    presets: [resolve('@babel/preset-env'), resolve('@babel/preset-react')],
  };
};
