const fs = require('fs-extra');
const { resolve } = require('path');

/**
 * 读取package.json
 * @param {*} type 分为__dirname和cwd
 * type: process.cwd() 是当前Node.js进程执行时的文件夹地址
 * type: __dirname 是被执行的js 文件的地址
 * @param {*} projectName 工程名称(__dirname下的时候不用传，cwd下必传)
 * @returns json文件路径和json对象(非字符串)
 */
async function getPackageJson(type = '__dirname', projectName = '.') {
  let packageJsonPath = resolve(__dirname, '../package.json');
  if (type === 'cwd') {
    packageJsonPath = resolve(process.cwd(), './', projectName, './', 'package.json');
  }
  // 确保文件存在。如果不存在，将创建一个新文件
  await fs.ensureFile(packageJsonPath);
  let packageJson = await fs.readFile(packageJsonPath, 'utf-8');
  // json文件内容为空时，readFile返回的对象会不存在
  const json = packageJson ? JSON.parse(packageJson.toString()) : {};
  // 获取json对象
  return {
    path: packageJsonPath,
    json
  }
}

/**
 * 更改package.json,替换成用户在脚手架中输入的值
 * process.cwd() 是当前Node.js进程执行时的文件夹地址
 * __dirname 是被执行的js 文件的地址
 * @param {*} projectName 项目包名称
 * @param {*} updateFields 需要修改的package.json字段
 */
async function updatePackageJson(projectName, updateFields) {
  let { path, json } = await getPackageJson('cwd', projectName);
  let packageJson = { ...json, ...updateFields };
  /**
   * 第二个参数为null或者不传，表示每个参数都会被序列化
   * 第三个参数传2，表示调整json字符串的缩进
   */
  packageJson = JSON.stringify(packageJson, null, 2);
  await fs.writeFileSync(path, packageJson);
}
/**
 * 从package.json的repository字段中获取download-git-repo下载的链接地址
 * GitHub - github:owner/name or simply owner/name
 * GitLab - gitlab:owner/name
 * Bitbucket - bitbucket:owner/name
 * 全写模式：direct:https://gihub.com/harby9/tphone-cli.git
 * @param {*} json packageJson对象
 */
function getDownloadRepository(json, branch = 'master') {
  const { repository } = json || {};
  let { type, url } = repository;
  const owner = url.match(/(https|https):\/\/[\s\S]*?\/([\s\S]*)/)[2];
  const downloadUrl = `${type}:${owner}#${branch}`;
  // const downloadUrl = `direct:${url}.zip#${branch}`;
  return downloadUrl;
}

module.exports = {
  getDownloadRepository,
  getPackageJson,
  updatePackageJson
}