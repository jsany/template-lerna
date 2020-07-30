# any

> Monorepo template ([Lerna](https://github.com/lerna/lerna) + [yarn](https://github.com/yarnpkg/yarn) workspace)

> Monorepo 管理多个模块/包，优化维护多包的工作流，解决多个包互相依赖，且发布需要手动维护多个包的问题

## 规范

- 各 package 源码入口统一为 src/index.ts
- 各 package 编译入口统一为 lib/index.js、es/index.js 和 dist/index.min.js
- 各 package 统一使用 TS/ES6 语法、使用 [father](https://github.com/umijs/father) 编译、压缩并输出到 lib/es
- 各 package 推送github时，忽略 lib/es 目录，减少仓库体积
- 各 package 发布时只发布 lib/es/dist 目录，不发布 src 目录

## 目标

- 完善的工作流

- 风格统一的编码

- 注释生成文档

- 一键式的发布机制

- 完美的更新日志

- ……

## 项目结构

```sh
.
├── packages
│   ├── module-A
│   ├── module-B
│   └── module-C
├── typings
│   ├── custom-typings.d.ts
│   └── index.d.ts
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── .npmignore
├── .prettierignore
├── .prettierrc
├── README.md
├── jest.config.js
├── lerna.json
├── package.json
└── tsconfig.json
```

## 约定式提交

MAJOR.MINOR.PATCH
主版本号.次版本号.修订号

提交说明:

```sh
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

类型：

- fix: 表示在代码库中修复了一个 bug, 对应修订号（PATCH）
- feat: 表示在代码库中新增了一个功能, 对应次版本号（MINOR）
- BREAKING CHANGE: 在可选的正文或脚注的起始位置带有 `BREAKING CHANGE:` 的提交,表示引入了破坏性 API 变更, 对应主版本号（MAJOR）.破坏性变更可以是任意 _类型_ 提交的一部分(例如：chore!: xxxx)，包含`!`以提醒注意破坏性变更的提交说明
- 其它情况:（例如 [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)（基于 Angular 约定））中推荐的 chore:、docs:、style:、refactor:、perf:、test: 及其他标签,也推荐使用 improvement，用于对当前实现进行改进而没有添加新功能或修复错误的提交

可选的作用域(针对当前项目是): module-A、module-B、module-C

example：

- 无作用域/正文

  ```vim
  workflow: first blood
  ```

- 有作用域，无正文

  ```vim
  workflow(module-A): add purge
  ```

- 有作用域，有正文,fix 会升级修订号

  ```vim
  fix(module-A): correct purge success/error info

  see the issue for details on the typos fixed

  closes issue #12
  ```

- 有作用域，有正文,feat 会升级次版本号

  ```vim
  feat(module-A): add purge success/error info

  增加清除cdn时成功反馈/失败反馈
  ```

- 有作用域，有正文,BREAKING CHANGE 会升级主版本号

  ```vim
  feat(module-A): add purge success/error info

  BREAKING CHANGE: 增加清除cdn时成功反馈/失败反馈
  ```

[更多请仔细阅读文档](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/)

## 常用命令

```sh
# 查看所有package，注意 package.json 中若设置了"private": true，则不会展示
$ lerna ls
```

### 安装相关依赖(四种)

- 安装所有依赖（bootstrap）

  正式流程为：

  1. 安装所有 package 的外部依赖.
  2. 对存在相互依赖的 package 创建软连接.
  3. 在所有已经 bootstrapped 的 package 中执行 `npm run prepublish`.
  4. 在所有已经 bootstrapped 的 package 中执行 `npm run prepare`.

  ```sh
  # --npm-client=yarn --hoist 会冲突
  # 默认开启 yarn workspace 特性替代 lerna bootstrap
  $ yarn
  ```

- 根项目安装依赖

  ```sh
  # yarn 使用 workspace 模式安装 npm 包时必须加 -W 参数
  $ yarn add -D -W [...pkg]
  ```

- 给 package 安装外部依赖

  ```sh
  $ yarn workspace module-A add chalk debug globby fs-extra mime --dev
  $ yarn workspace module-A add chalk debug globby fs-extra mime
  ```

- 给 package 安装内部依赖

  ```sh
  # 一定要指定正确的版本号，不然会到npm查找包
  $ yarn workspace module-A add module-B@^1.0.0 --dev
  $ yarn workspace module-A add module-B@^1.0.0
  ```

### 清除依赖

```sh
$ lerna clean && rm -rf ./node_modules
# or
$ yarn run clean
```

### 运行命令

- 执行 package 下 npm script

  ```sh
  # lerna run [...cmd] --scope @scope
  $ lerna run compile --scope module-A
  ```

- 在任何 package 下执行任意的命令

  ```sh
  $ lerna exec -- <command> [..args] # runs the command in all packages
  $ lerna exec -- rm -rf ./node_modules
  ```

### 导入 package

从现有仓库导入一个 package，这种方式下会保留原有的 commit 的信息
`--flatten`: 有 merge 冲突,将每次合并提交作为对引入的合并进行的单个更改
`--dest`: 指定导入的目录(lerna.json 中设定的目录)

```sh
$ lerna import <path-to-external-repository>
```

### 发布

正式流程为：

1. 执行 lerna updated 来确定哪些包需要被发布.
2. 如有必要会升级 lerna.json 的 version 字段。
3. 对所有需要 update 的 package 进行版本的更新，并写入他们的 package.json.
4. 队友有需要 update 的 package 进行依赖申明 specified with a caret (^).
5. 创建一个 git commit 和 tag
6. 把包发布至 npm

```sh
# 查看更改，同样 package.json 中设置了 "private": true 的 package 不会展示
$ lerna changed
# 每次发布会自动更新相关package的版本号，并且会更新引用该package的其他package依赖
$ lerna publish
```

附：较为有用的附加参数

- `from-git`: 将识别由 tag 标记的包并将其发布到 npm,可处理 '已打成 git tag, 但 npm publish 发布失败'的问题

  ```sh
  $ lerna publish from-git
  ```

- `--dist-tag <tag>`: 使用传入的 tag 把包发布至 npm 对应的 dist-tag

  ```sh
  $ lerna publish --dist-tag beta
  ```

- `--git-remote <name>`: 把修改推送到其它的源， 而不是 origin

  ```sh
  $ lerna publish --git-remote upstream
  ```

- `--conventional-commits`: 遵从 [Conventional Commits Specification](https://conventionalcommits.org/) 进行版本生成和 changlog 生成

  ```sh
  $ lerna publish --conventional-commits
  ```

- `--force-publish`: 强制发布指定的包(以逗号分隔)或所有程序包

  ```sh
  $ lerna publish --force-publish
  ```

- `--no-changelog`: 不生成任何`CHANGELOG.md`文件

  ```sh
  $ lerna publish --no-changelog
  ```

- `--yes`: 跳过所有确认提示,用于 ci 自动输入

  ```sh
  $ lerna publish --yes
  ```
