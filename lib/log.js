const chalk = require('chalk');
const logSymbols = require('log-symbols');
const ora = require('ora');
const loading = ora('Loading');

// 开始loading
const startLoading = (text = '加载中...') => {
  loading.text = chalk.cyan(text);
  loading.color = 'cyan';
  loading.start();
}

// 结束loading
const endLoading = () => {
  loading.text = '';
  loading.stop();
}

// loading成功的提示
const successConsole = (text = '加载成功...', symbol = 'success') => {
  console.log(logSymbols[symbol], chalk.green(text));
}

const warningConsole = (text = '加载成功...', symbol = 'warning') => {
  console.log(logSymbols[symbol], chalk.yellow(text));
}

// loading失败的提示
const failedConsole = (text = '加载失败...', symbol = 'error') => {
  console.log(logSymbols[symbol], chalk.red(text));
}

module.exports = {
  startLoading,
  endLoading,
  successConsole,
  warningConsole,
  failedConsole
}