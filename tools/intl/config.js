const ids = [
  '1560',
  '1608',
  '13205',
  '13781',
  '17235',
  '19331',
  '19378',
  '19475',
  '19498',
  '19853',
  '20368',
  '20771',
  '22827',
  '23202',
  '24711',
  '24865',
  '31847',
  '36577',
]; // 多语言源词条id(无需设置,程序自动识别并替换)
const extraIds = ['152']; // 程序未识别的id手动在这里添加
const moduleName = 'WIND投资终端'; // 应用关联的模块名称(多语言平台中定义)
const localeIsJSON = false; // 是否生成json格式文件(过渡方案使用)，默认为false
const basePath = '../../src/'; // 相对路径用'.'开始
const localeDirectory = '../../src/locale'; // 多语言源文件的目录，可根据需要自行更改
const ignorePath = ['.svn', 'locale']; // 查找词条id或替换中文词条时跳过的文件夹，如.svn文件、多语言源文件
const fileType = ['js', 'jsx']; // 提取词条id的文件类型
const intlPath = './src/utils/intl.js'; // intl文件的路径(相对于package.json)，需自定义，为空则不会自动导入intl模块
const intlModule = 'intl'; // 导入intl的模块名，需自定义
const queryLength = 2; // 设置小于queryLength的词条不会查询替换，避免异常查询
const SUBMITPERSON = ['丁建锋']; // 存在匹配到多个词条时，SUBMITPERSON用来筛选特定的提交人提交的词条，筛选唯一则替换
const reactMode = false; // 是否是react项目，用于词条替换规则的判断

const langs = {
  en: 'en-US',
  cn: 'zh-CN',
};

module.exports = {
  ids,
  extraIds,
  moduleName,
  localeIsJSON,
  basePath,
  localeDirectory,
  ignorePath,
  fileType,
  intlPath,
  intlModule,
  queryLength,
  SUBMITPERSON,
  reactMode,
  langs,
};
