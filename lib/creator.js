const validateProjectName = require('validate-npm-package-name');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const { resolve } = require('path');
const fs = require('fs-extra');
const { warningConsole, failedConsole } = require('./log');
const { getPackageJson, getDownloadRepository } = require('./pkgJson');


// 验证包名的合法性以及重复包名的处理
async function validatePackageName(projectName) {
  let valid = true;
  // 验证包名的合法性
  const { validForNewPackages, errors, warnings } = validateProjectName(projectName);
  if (!validForNewPackages) {
    [
      ...(errors || []),
      ...(warnings || [])
    ].map(error => {
      failedConsole(`项目命名错误，原因是：${error}`);
    });
    valid = false;
  }
  // 出现重复包名时的处理
  const packagePath = resolve(process.cwd(), './', projectName);
  if (fs.existsSync(packagePath)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: warningConsole(`当前路径下已存在${projectName}，请执行以下操作`),
        choices: [
          { name: '取消', value: false },
          { name: '覆盖', value: 'overwrite' }
        ]
      }
    ]);
    if (!action) valid = false;
    else if (action === 'overwrite') {
      await fs.remove(packagePath)
    }
  }
  return valid;
}

// 从git上拉取模板源码
async function downloadGitTemplate(projectName) {
  const { json } = await getPackageJson();
  const downLoadUrl = getDownloadRepository(json);
  return new Promise((resolve, reject) => {
    try {
      download(downLoadUrl, projectName, error => {
        if (error) return reject(error);
        return resolve();
      });
    } catch (error) {
      return reject(error);
    }
  });
}

/**
 * 采用一问一答的形式,来修改package.json中的字段
 * @param {*} 如果name为空，则设置工程名称为packag.json中的name 
 * @returns 
 */
async function getPkgJsonUpdateFields(projectName) {
  const prompList = [
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称:',
      default: projectName
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息:'
    },
    {
      type: 'input',
      name: 'author',
      message: '请输入作者信息:'
    }
  ];
  // 获取需要修改的package.json字段
  const updatePromp = await inquirer.prompt(prompList);
  return updatePromp;
}

module.exports = {
  validatePackageName,
  downloadGitTemplate,
  getPkgJsonUpdateFields
}