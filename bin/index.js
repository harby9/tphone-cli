#!/usr/bin/env node

const program = require('commander');
const { startLoading, endLoading, failedConsole, successConsole } = require('../lib/log');
const { validatePackageName, downloadGitTemplate, getPkgJsonUpdateFields } = require('../lib/creator');
const { updatePackageJson } = require('../lib/pkgJson');


// 设置版本
program
  .version(`@tphone/cli ${require('../package.json').version}`)
  .usage('<command> [options]')

// 创建项目
program
  .command('create <project-name>')
  .description('创建一个新的天蜂项目')
  .action(async (projectName) => {
    // 验证包名的合法性
    const valid = await validatePackageName(projectName);
    if (!valid) process.exit();
    startLoading('正在准备项目...');
    // 从git上下载模板
    downloadGitTemplate(projectName).then(async () => {
      endLoading();
      successConsole('项目准备完毕！');
      // 键入package.json中需要修改的项目名、描述、作者
      const updateFields = await getPkgJsonUpdateFields(projectName);
      // 更新package.json
      updatePackageJson(projectName, updateFields);
      successConsole('初始化项目成功！');
    }).catch(error => {
      endLoading();
      failedConsole(`准备项目失败！原因是：${error}`);
    })
  })

program.parse(process.argv);