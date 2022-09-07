# Wind React App

## 说明

`wind-react-app` 是在 `create-react-app` 基础上修改而来，关于 `create-react-app` 的说明请参考[官方文档](https://create-react-app.dev/docs/getting-started)

## 升级react-script 

若已eject，无法直接升级，自行管理需要升级的依赖。
若未eject，步骤如下:

* 做好备份，将代码提交至svn，node_modules压缩一份保存。
* 先整理下package.json中的依赖（包括devDependencies和dependencies），删除react-script依赖的包(如果有的话)，可对照脚手架，若实在不清楚可先不删除。
* 删除lock文件package-lock.json(npm)或yarn.lock(yarn)
* 通过如下命令执行安装, 注意yarn和npm不要混用:

``` 
 yarn add react-scripts@3.4.1 -E
```

安装新版 `react-app-rewired` 和 `customize-cra` (修改配置用)

``` 
 yarn add react-app-rewired@2.1.6 customize-cra@1.0.0
```

修改config-overrides.js，使用 `customize-cra` 的 api

执行npm start，可能遇到依赖错误，则是因为刚才的依赖没有清理干净，按照提示删掉冲突的依赖和lock文件，重新执行安装。
其他问题基本按照提示处理即可

## 添加typescript支持

1. react-script@1.0.17不支持typescript,第一步是先升级react-script(见上)

2. 安装typescript及相关类型声明

``` 
yarn add typescript@3.9.7 -D

yarn add @types/jest @types/node @types/react @types/react-dom @types/react-loadable @types/react-router-dom
```

3. 增加 `tsconfig.json` 文件(_tsconfig.json，将下划线去掉即可，若无会自动生成)

4. 任意文件后缀改为 `tsx/ts` , 则会应用 `typescript` 规则

5. 目前 `typescript` 已经采用 `eslint` 作为检查工具，详见下方

## eslint 

* 在 `vscode` 中安装好 `ESlint` 扩展后，目录下的 `.eslintrc.js` 便会生效，这里应用了缩减版的 `airbnb` 规则，比较严格，可能会有不少警告。可先通过 `Eslint:fix all auto-fixable Problem` 功能解决可自动解决的问题，然后再逐个解决警告

* 编译时使用的还是 `react-scripts` 默认规则，比较简单，容易通过以免影响发布。可以通过 `.env` 中的 `EXTEND_ESLINT=true`在编译时也启用`.eslintrc.js`中的规则

* 若需要 `vscode` 支持 `typescript` 提示，因为 react-scripts 已经安装了 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin` ，因此只需要修改 `.eslintrc.js` 即可：将 `parser` 的值改为 `@typescript-eslint/parser` ，在 `plugins` 中添加 `@typescript-eslint`
* 若在 `ts` 文件中没有生效，请在 `vscode` 设置中搜索 `eslint:probe` ，将 `typescript` 和 `typescriptreact` 添加进去

## icon

新版本不再推荐使用使用字体文件实现图标，而是改用svg，不过新版本icon组件还是提供了对字体图标文件的兼容性支持

## chart

新版本改用了echarts作为默认组件，且采用了按需外部加载的方式，以避免增加默认包的大小
当然你还是可以继续使用highcharts，以兼容历史代码。

通过如下代码新增 `echarts-for-react` , 不包含echarts：

``` 
 yarn add echarts-for-react@latest
```
