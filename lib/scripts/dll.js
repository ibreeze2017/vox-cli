const build = require('./build');


module.exports = function(options) {
  build({
    ...options,
    mode: 'dll',
  });
};
