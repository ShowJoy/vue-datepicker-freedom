// 高亮字符串输出
var chalk = require('chalk');
// 语义化工具
var semver = require('semver');
var packageConfig = require('../package.json');
// node执行shell脚本
var shell = require('shelljs');

function exec (cmd) {
  // 执行命令，并返回输出
  return require('child_process').execSync(cmd).toString().trim();
}

var versionRequirements = [
  {
    name: 'node',
    // 当前环境版本
    currentVersion: semver.clean(process.version),
    // package.json中配置的版本要求
    versoinRequirement: packageConfig.engines.node
  }
];

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versoinRequirement: packageConfig.engines.npm
  });
}

module.exports = function () {
  var warnings = [];
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versoinRequirement)) {
      warnings.push(mod.name + ':' + chalk.red(mod.currentVersion) + ' should be ' + chalk.green(mod.versionRequirement));
    }
  }

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must following to modules:'));
    console.log();
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i];
      console.log('    ' + warning);
    }
    console.log();
    process.exit(1);
  }
};
