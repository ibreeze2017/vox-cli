const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getWebpackConfig = require('../config/getWebpackConfig');
const Logger = require('../utils/Logger');
const { isPortOccupied } = require('../utils/netUtil');

module.exports = function(options) {
  const config = getWebpackConfig({
    ...options,
    mode: 'development',
  });
  const compiler = webpack(config);
  const finalConfig = { ...config.devServer };
  const { port = 7777, host = '0.0.0.0', hooks = [] } = finalConfig;
  let timer;
  const defaults = {
    tryDelay: 2000,
    retryWhilePortInUsed: true,
    getNextPort: port => {
      return port + 1;
    },
  };

  const { tryDelay, getNextPort, retryWhilePortInUsed } = Object.assign({}, defaults, options);
  safeStart(host, port, (port) => {
    startListen(port);
    console.log('Project Running at: http://localhost:' + port + '/');
  });

  function safeStart(host, port, callback) {
    clearTimeout(timer);
    isPortOccupied(host, port, (flag) => {
      if (!flag) {
        callback && callback(port, host);
        return;
      }
      if (!retryWhilePortInUsed) {
        Logger.error(`Start server failed, port ${port} is in using !`);
        process.exit(-1);
      }
      Logger.info(`port [${port}] is in using, try to run at port ${port + 1}....`);
      timer = setTimeout(() => {
        safeStart(host, getNextPort(port), callback);
      }, tryDelay);
    });
  }

  function startListen(port) {
    const server = new WebpackDevServer(compiler, {
      ...config.devServer,
      hot: true,
      inline: true,
      historyApiFallback: true,
      disableHostCheck: true,
      noInfo: true,
      stats: {
        assets: true,
        chunks: false,
        // 添加 namedChunkGroups 信息
        chunkGroups: false,
        // 将构建模块信息添加到 chunk 信息
        chunkModules: false,
        // 添加 chunk 和 chunk merge 来源的信息
        chunkOrigins: false,
        // 添加构建模块信息
        modules: false,
        colors: true,
        reasons: false,
        children: false,
      },
    });
    server.listen(port, host, (err) => {
      if (err) {
        Logger.error('ERROR:', err);
      }
      if (hooks) {
        hooks.forEach(hook => {
          hook && hook(finalConfig, err);
        });
      }
    });
  }
};

