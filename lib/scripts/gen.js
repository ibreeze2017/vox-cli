const { checkIsValidProject } = require('../utils/checkUtil');
const { createPage, createComponent, createService, createModel } = require('../utils/create');
const Logger = require('../utils/Logger');

function gen(program) {
  // 检测是否合法项目
  if (!checkIsValidProject()) {
    Logger.error('Invalid project configuration, please initialize first, try run tex --init ！');
    return;
  }
  // 参数校验
  const { args = [] } = program;

  if (args.length < 1) {
    return;
  }
  const [type, name] = args;
  switch (type.toLowerCase()) {
    case 'page':
      createPage(name);
      break;
    case 'service':
      createService(name, {
        ownPage: '' || program.page,
      });
      break;
    case 'model':
      createModel(name, {
        ownPage: '' || program.page,
      });
      break;
    case 'component':
      createComponent(name);
      break;
    default:
      Logger.error('invalid option ' + type + ', please try vox --help');
      return;
  }
}


module.exports = gen;
