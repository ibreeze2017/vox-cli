const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./demo/index.ts'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname) + '/dist',
    publicPath: '/',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['js', 'jsx', '.ts', '.tsx', '.js', '.json'],
  },
  mode: 'development',
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
              plugins: () => [
                require('autoprefixer')(),
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
              plugins: () => [
                require('autoprefixer')(),
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
  devServer: {
    hot: true,
    publicPath: '/',
    port: 7778,
    open: false,
  },
  externals: {
    jquery: '$',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'demo/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 800 }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
