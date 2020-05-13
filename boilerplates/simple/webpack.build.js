const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.ts'],
  output: {
    filename: 'v-popup.umd.js',
    path: path.resolve(__dirname) + '/lib',
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'VMenu',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['js', 'jsx', '.ts', '.tsx', '.js', '.json'],
  },
  mode: 'production',
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ['babel-loader', 'awesome-typescript-loader'] },
      { test: /\.txt/, use: ['raw-loader'] },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {},
          },
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: () => [
                require('autoprefixer')(),
                //CSS浏览器兼容
              ],
            },
          },
        ],
        exclude: ['/node_modules/'],
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: () => [
                require('autoprefixer')(),
                //CSS浏览器兼容
              ],
            },
          },
          'less-loader',
        ],
        exclude: ['/node_modules/'],
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-sprite-loader',
          options: {},
        },
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
  ],
};
