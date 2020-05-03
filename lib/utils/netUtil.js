const net = require('net');

/**
 * 判断主机端口是否被占用
 * @param host
 * @param port
 * @param callback
 */
function isPortOccupied(host, port, callback) {
  const server = net.createServer().listen({ host, port });
  server.on('listening', () => {
    server.close();
    callback && callback(false);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      callback && callback(true);
    } else {
      console.log(error);
    }
  });
};
module.exports = { isPortOccupied };
