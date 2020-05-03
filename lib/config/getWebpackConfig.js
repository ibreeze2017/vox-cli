const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniExtract = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WebpackBar = require("webpackbar");
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");
const getAnalzerPlugin = require("./getAnalzerPlugin");
// const webpackMerge = require("webpack-merge");
const { getProjectPath, resolve } = require("../utils/helper");
const { flatObject } = require("../utils/util");
const getBabelConfig = require("./getBabelConfig");

module.exports = function getWebpackConfig(options = {}) {
  const pkg = require(getProjectPath("package.json"));
  const rootPath = getProjectPath();
  const MiniExtractLoader = {
    loader: MiniExtract.loader,
    options: {
      publicPath: "/",
      hmr: false
    }
  };
  const babelConfig = getBabelConfig();

  const { output = "dist", useDll = true, compress = true, inject, publicPath = "/", dll = [], page = {} } = options;
  const distPath = getProjectPath(output);
  const isDevMode = options.mode === "development";
  const isDLL = options.mode === "dll";
  const isAnalysis = options.mode === "analysis";
  const mode = (isDevMode || isDLL) ? "development" : "production";
  const dllOptions = [
    ...dll
  ];
  const isMulPage = Array.isArray(page);
  const pageOptions = isMulPage ? [...page] : [{
    ...page
  }];

  const shouldCompress = !(isDevMode || !compress);

  const pluginList = [
    [0, new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn)$/)], // 忽略 moment.js的所有本地文件
    [4, getAnalzerPlugin()],
    [3, new webpack.DllReferencePlugin({
      context: getProjectPath(),
      manifest: isDLL ? "" : require(getProjectPath("./build/bundle.manifest.json"))
    })],
    [3, new HtmlWebpackTagsPlugin({
      scripts: dllOptions.map(item => `${item.name}.dll.js`),
      hash: true,
      publicPath: path.posix.join("/", "/static/js"),
      append: false
    })],
    [2, new CleanWebpackPlugin({
      verbose: false,
      dry: false
    })],
    [2, new CopyWebpackPlugin([
      {
        from: getProjectPath("public"),
        to: distPath,
        ignore: [".*"]
      }
    ])],
    [1, new CopyWebpackPlugin([
      {
        from: getProjectPath("public"),
        to: distPath,
        ignore: [".*"]
      },
      {
        from: getProjectPath("build"),
        to: getProjectPath("dist/static/js/"),
        ignore: [shouldCompress ? "*.map" : ".*"]
      }
    ])],
    [0, new FilterWarningsPlugin({
      // suppress conflicting order warnings from mini-css-extract-plugin.
      // ref: https://github.com/ant-design/ant-design/issues/14895
      // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
      exclude: /mini-css-extract-plugin[^]*Conflicting order/
    })],
    [0, new MiniExtract({
      filename: "static/css/[name].css"
    })],
    [0, new ManifestPlugin()],
    [0, new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode)
    })],
    [1, new webpack.HotModuleReplacementPlugin()],
    [0, new CaseSensitivePathsPlugin()],
    [6, new SpeedMeasureWebpackPlugin()],
    [5, new webpack.BannerPlugin({
      banner: `
Copyright 2017-present, 微风平台, Inc.
All rights reserved.
      `, // 其值为字符串，将作为注释存在
      raw: false, // 如果值为 true，将直出，不会被作为注释
      entryOnly: true // 如果值为 true，将只在入口 chunks 文件中添加
    })],
    [7, new LicenseCheckerWebpackPlugin({
      ignore: ["@babel/*"],
      outputFilename: "LICENSE.txt"
    })],
    [0,
      new WebpackBar({
        name: "Tex Tools",
        color: "#0d878e",
        profile: true,
        basic: false
      })
    ]
  ];
  const defaultPageOptions = {
    title: "VOX Page",
    inject: true,
    minify: !shouldCompress ? false : {
      removeComment: true,
      collapseWhitespace: true
    }
  };
  // 多入口
  pageOptions.forEach(item => {
    const { name: entryName, out, template, title, inject: itemInjection } = item;
    pluginList.push([
      0,
      new HtmlWebpackPlugin({
        ...defaultPageOptions,
        ...item,
        title,
        ...flatObject(inject),
        ...flatObject(itemInjection),
        inject: true,
        filename: `${out || entryName}.html`,
        template: getProjectPath(template || `./src/pages/${entryName}/index.ejs`)
      })]);
  });
  const plugins = pluginList.filter(([state]) => (
    state === 0 ||
    (isDevMode && state === 1) ||
    (!isDevMode && state === 2) ||
    (isDevMode && useDll && state === 3) ||
    (isAnalysis && state === 4)
  )).map(([, plugin]) => plugin);
  const webpackConfig = {
    entry: {
      app: getProjectPath("./src/pages/index.ts")
    },
    output: {
      filename: "static/js/[name].[hash].js",
      chunkFilename: "static/js/[name].[hash].js",
      path: distPath,
      publicPath
    },
    mode,
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": getProjectPath("src"),
        "@common": getProjectPath("src/common"),
        "@pages": getProjectPath("src/pages"),
        "@shared": getProjectPath("src/shared"),
        "@component": getProjectPath("src/shared/component"),
        "@entity": getProjectPath("src/shared/entity")
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: resolve("babel-loader"),
              options: babelConfig
            },
            { loader: resolve("ts-loader") }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: resolve("babel-loader"),
              options: babelConfig
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.d\.ts$/,
          loader: resolve("ignore-loader")
        },
        { test: /\.txt/, use: ["raw-loader"] },
        {
          test: /\.json$/,
          type: "javascript/auto",
          loader: resolve("json-loader")
        },
        {
          test: /\.css$/,
          use: [
            MiniExtractLoader,
            {
              loader: resolve("css-loader"),
              options: {
                modules: false
              }
            },
            {
              loader: resolve("postcss-loader"),
              options: {
                plugins: () => [
                  require("autoprefixer")()
                ]
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniExtractLoader,
            {
              loader: resolve("css-loader"),
              options: {
                modules: false
              }
            },
            {
              loader: resolve("postcss-loader"),
              options: {
                plugins: () => [
                  require("autoprefixer")()
                ]
              }
            },
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniExtractLoader,
            {
              loader: "css-loader",
              options: {
                modules: false
              }
            },
            {
              loader: "sass-loader"
            }]
        },
        {
          test: /\.styl$/,
          use: [
            MiniExtractLoader,
            {
              loader: "css-loader",
              options: {
                modules: false
              }
            }, {
              loader: "stylus-loader"
            }]
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          exclude: /node_modules/,
          options: {
            limit: 15360,
            name: "assets/[hash:8].[name].[ext]",
            fallback: "file-loader"
          }
        },
        {
          test: /\.vx.svg/,
          use: {
            loader: "svg-sprite-loader",
            options: {}
          }
        }
      ]
    },
    devtool: false,
    plugins,
    optimization: { // webpack优化模块
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          cache: true,  // 开启缓存
          parallel: true, // 开启多进程编译,大大提高构建速度
          extractComments: false,
          sourceMap: !shouldCompress, // 开启sourceMap, 将错误信息映射到相应模块(会减慢编译速度)
          terserOptions: { // 设置压缩js的选项,对比之前的配置,只需要使用默认选项即可
            warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
            compress: {
              collapse_vars: true,
              drop_console: false, // 删除所有的 `console` 语句，可以兼容ie浏览器
              reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
            },
            output: {
              comments: false, // 剔除所有注释(默认)
              beautify: false // 最紧凑的输出(默认)
            }
          }
        })
      ],
      moduleIds: "hashed",
      runtimeChunk: { // 单独生成一个chunk, 包含了运行时每个入口点
        name: entrypoint => `runtimechunk~${entrypoint.name}`
      },
      noEmitOnErrors: true, // 编译出现错误时,使之不会抛出错误
      splitChunks: { // 分割代码
        cacheGroups: { // 缓存组
          node_modules: {
            name: "vendor", // 组的名字
            test: /[\\/]node_modules[\\/]/, // 正则匹配规则
            chunks: "all", // 'initial', 'async', 'all' 分别对应优化时只选择非异步引入，异步引入, 所有引入方式
            minChunks: 2, // 触发分割代码优化的最小公用量, 2就比较合适啦~
            priority: -10 // 触发优先级
          }
        }
      }
    }
  };
  // compress
  if (!shouldCompress) {
    webpackConfig.devtool = "source-map";
    webpackConfig.optimization = {
      minimize: false
    };
  }
  // dev server
  if (isDevMode) {
    webpackConfig.devServer = {
      contentBase: path.join(__dirname, "dist"), // 开发服务器文件源 注意，推荐使用绝对路径。 但是也可以从多个目录提供内容(使用[]分割)
      host: "0.0.0.0",
      port: 7777, // 开启的本地开发服务器端口
      compress: true, // 一切服务都启用gzip 压缩
      bonjour: true,
      historyApiFallback: true, // index.html可能必须提供该页面以代替任何404回复
      hot: true, //开启模块热替换
      hotOnly: true, // 当有些模块不允许热替换时,构建失败时正常显示页面并报错
      open: false, // 构建完成后打开浏览器
      progress: false, // 将构建进度显示到控制台
      proxy: {
        "/local": {
          target: "http://127.0.0.1:8028/static/cdn",
          pathRewrite: { "^/local": "" }
        }
      }
      // proxy: [{ // 开启本地服务网络代理
      //   context: ["/himea", "/py"], // 被代理url
      //   target: "http://localhost:7777", // 代理指向例如 ==> http://test/123
      // }],
      // publicPath: "/1234/", 设置以后可以使用 http://localhost:7777/1234/ 来访问我们的包 (注意: 一定要保证/结尾)
    };
  }

  if (isDLL) {
    const entry = {};
    dllOptions.forEach(({ name, entry: entryList }) => {
      entry[name] = entryList;
    });
    return {
      entry,
      output: {
        path: getProjectPath("build"),
        filename: "[name].dll.js",
        library: "[name]_library"
      },
      mode: "development",
      devtool: "source-map",
      resolve: {
        extensions: [".tsx", ".ts", ".js"]
      },
      module: {},
      plugins: [
        new CleanWebpackPlugin({
          verbose: false,
          dry: false
        }),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        new webpack.DllPlugin({
          context: getProjectPath(),
          path: getProjectPath("build/[name].manifest.json"),
          name: "[name]_library"
        }),
        new WebpackBar({
          name: "Tex Tools",
          color: "#0d878e"
        })
      ],
      optimization: {
        minimize: false
      }
    };
  }

  return webpackConfig;
};
