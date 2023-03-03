# 脚手架如何使用
``` sh
npm install -g @tphone-beta/cli
tphone create my-project
```

# 脚手架是如何开发的

1、使用node开发命令行工具所执行的js脚本，必须要在顶部加入#!/usr/bin/env node声明

2、package.json文件中指定"bin": { "tphone": "bin/index.js" }

3、可通过软连接npm link进行调试

4、原生process.argv可以获取用户在控制台输入的命令参数(从第5步开始，使用第三方包完成相关开发)
   eg.只输入tphone(后面无参数)，则只会显示一个数组，包含node和脚本文件的路径
   eg: tphone --help,数组中的第三个参数就会是‘--help’

5、commander.js，可以自动的解析命令和参数，用于处理用户输入的命令

6、download-git-repo，下载并提取 git 仓库，用于下载项目模板

7、inquirer.js，通用的命令行用户界面集合，用于和用户进行交互

8、fs-extra，用于对文件做读取、修改、删除等操作

9、ora，文件下载过久的话，可以用于loading效果

10、chalk，可以给终端的console.log加上颜色

11、log-symbols，可以在console.log的文字前加上 √ 或 × 等图标

