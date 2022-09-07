/**
 * @summary
 * 1. 将指定目录下的中文词条替换为id和中文注释，匹配到多个词条时，筛选SUBMITPERSON指定提交人提交的词条 入口：wordToId(); 执行命令：node tools/intl/intl wordToId
 * 2. 提取src目录下所有指定类型文件中的词条id并添加到config.js文件的ids数组中 入口：printIds(); 执行命令：node tools/intl/intl printIds
 * 3. 根据词条id生成locale多语言源文件 入口：intlToLocale(); 执行命令：node tools/intl/intl writeLocale
 */


const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { ajaxMethod } = require('./request');
const config = require('./config');

const moduleName = config.moduleName; // 多语言平台需要关联的模块名
const localeIsJSON = config.localeIsJSON; // 设置生成的多语言源文件的类型是否是旧的json文件，默认为false
const basePath = config.basePath.startsWith('.') ? path.join(__dirname, config.basePath) : config.basePath; // 提取词条id的文件目录
const localeDirectory = config.localeDirectory; // 多语言源文件的目录，可根据需要自行更改
const ignorePath = config.ignorePath; // 查找词条id时跳过的文件夹
const fileType = config.fileType; // 提取词条id的文件类型，可根据需要自行修改
const intlPath = config.intlPath ? path.join(__dirname, '../../', config.intlPath) : config.intlPath; // intl文件的路径，需自定义
const intlModule = config.intlModule; // 导入intl的模块名，需自定义
const queryLength = config.queryLength; // 设置小于queryLength的词条不会查询替换，避免异常查询
const SUBMITPERSON = config.SUBMITPERSON; // 存在匹配到多个词条时，SUBMITPERSON用来筛选特定的提交人提交的词条
const reactMode = config.reactMode; // 是否是react项目

const langs = config.langs;

let idsFound = new Set(); // 存放查找到的词条id
let words = new Map(); // 存放词条
let illegal = []; // 存放需要跳过的文件目录
let wordMap = new Map(); // 临时存放从文件中匹配到的词条

let argument = process.argv[2];


/**
 * 判断是否是目录
 * @param {*传入的文件路径} fileName
 */
function isDirectory(fileName) {
  return fs.statSync(fileName).isDirectory();
}

/**
 * 判断是否是文件
 * @param {*传入的文件名} fileName
 */
function isFile(fileName) {
  return fs.statSync(fileName).isFile();
}

/**
 * 判断该文件的类型
 * @param {*传入的文件名} fileName
 */
function isLegalFile(fileName) {
  let type;
  let index = fileName.lastIndexOf('.');
  if (index > -1) {
    type = fileName.substring(index + 1);
  }
  if (fileType.indexOf(type) !== -1) {
    return true;
  }

  return false;
}

/**
 * 判断文件目录是否需要跳过
 * @param {*待判断的文件路径} fileName
 */
function isLegalPath(fileName) {
  fileName = fileName.replace(/\\/g, '/');
  if (illegal.indexOf(fileName) !== -1) {
    return false;
  }
  return true;
}

/**
 * 从指定目录下匹配要跳过的文件目录，添加到illegal数组中
 * @param {*待匹配的指定目录} fileName
 */
function addIllegalPath(fileName) {
  ignorePath.forEach((filePath) => {
    let files = glob.sync(`${fileName}/**/${filePath}`);
    if (files && files.length) {
      illegal = illegal.concat(files);
    }
  });
}

/**
 * 根据词条id去多语言平台查找词条
 * @param {*词条id} ids
 */
async function getWordFromServer(ids, wordArr) {
  if (ids && ids.length) {
    let uniqueIds = Array.from(new Set(ids));

    let promises = uniqueIds.map((id) => {
      let search = `{ID:${id}}`;
      let promise = ajaxMethod({ method: 'GetLanguageModule', params: [search, 1, 20] }).then((info) => {
        if (info.Data) {
          let data = JSON.parse(info.Data);
          if (data == null) {
            console.log(`无法在服务器精确匹配词条ID：${id}`);
          } else if (data.length > 1) {
            console.log(`服务器匹配词条ID：${id} 项太多，请自行选择`);
          } else if (data.length === 1) {
            let item = data[0];
            let regex1 = /%[sd]/g;
            let zhNum = 0;
            let enNum = 0;
            let wordItem = {
              ID: item.ID,
              CHFULLNAME: item.CHFULLNAME.replace(regex1, () => {
                let replacement;
                if (zhNum === 0) {
                  replacement = '{s}';
                } else {
                  replacement = `{s${zhNum}}`;
                }
                zhNum += 1;
                return replacement;
              }),
              ENFULLNAME: item.ENFULLNAME.replace(regex1, () => {
                let replacement;
                if (enNum === 0) {
                  replacement = '{s}';
                } else {
                  replacement = `{s${enNum}}`;
                }
                enNum += 1;
                return replacement;
              }),
              MODULENAME: item.MODULENAME,
            };
            if (wordItem.MODULENAME.indexOf(moduleName) === -1) {
              console.log(`警告：词条ID ${id} 未关联 <${moduleName}> 模块！`);
            }
            words.set(id, wordItem);
          }
        }
      }).catch(() => {
        console.log(`ajaxMethod发生错误，词条ID：${id}\n`);
      });

      return promise;
    });

    await Promise.all(promises);
  } else if (wordArr && wordArr.length) {
    let promises = wordArr.map((word) => {
      let search = `{Other:chfullname='${word}'}`;
      let promise = ajaxMethod({ method: 'GetLanguageModule', params: [search, 1, 20] }).then((info) => {
        if (info.Data) {
          let data = JSON.parse(info.Data);
          if (data == null) {
            console.log(`无法在服务器精确匹配词汇：${word}`);
          } else if (data.length > 1) {
            data = data.filter(wordObject => SUBMITPERSON.indexOf(wordObject.SUBMITPERSON) > -1);
            if (data.length === 1) {
              let item = data[0];
              wordMap.set(item.CHFULLNAME, item.ID);
            }
            // console.log(`服务器匹配词汇：<${word}> 项太多，请自行选择`);
          } else if (data.length === 1) {
            let item = data[0];
            wordMap.set(item.CHFULLNAME, item.ID);
          }
        }
      }).catch(() => {
        console.log(`ajaxMethod发生错误，词条：${word}\n`);
      });

      return promise;
    });

    await Promise.all(promises);
  }
}

/**
 * 指定文件中的词条替换为词条id及其注释的形式
 * @param {*文件内容} data
 * @param {*文件路径} filePath
 */
async function convertToId(data, filePath) {
  // console.log(`开始翻译${filePath}文件：`);
  wordMap.clear();
  // 替换词条
  let regex = /(?<!\/\* no intl \*\/)(['"`])([^"'`\n]*[\u4e00-\u9fa5][^"'`\n]*)\1/g; // [\u4e00-\u9fa5()%/]
  let wordArr = data.match(regex);
  if (wordArr && wordArr.length) {
    wordArr = wordArr.map(word => word.match(/[^"'`\n]+/)[0]);
    // 过滤词条长度小于queryLength的词条，避免异常查询
    wordArr = wordArr.filter(word => word.length >= queryLength && !(/(\/\*)[\s\S]*(\*\/)/.test(word)));
    await getWordFromServer(null, wordArr);
    data = data.replace(regex, ($0, $1, $2) => {
      let word = $2;
      let id = wordMap.get(word);
      if (id) {
        if (reactMode && $1 === '"') { // jsx 属性（不严谨）
          return `{intl('${id}'/* ${word} */)}`;
        } else if ($1 === '\'') { // js string
          return `intl('${id}'/* ${word} */)`;
        }
        return `intl('${id}'/* ${word} */)`;
      }

      return $0;
    });
  }

  // <>xxxxx<>的情况 // /(?<=[^=]>[\s]*)(?<!\{\/\*no intl\*\/\})([^<]*[\u4e00-\u9fa5][^<]*)(?=[\s]*<)/g
  let regex2 = /(?<=[^=]>[\s]*)([^<]*[\u4e00-\u9fa5][^<]*)(?=[\s]*<)/g; // [\u4e00-\u9fa5()%/]
  let wordArr2 = data.match(regex2);
  if (wordArr2 && wordArr2.length) {
    wordArr2 = wordArr2.map(word => word.match(/[^"'`\n]+/)[0]);
    wordArr2 = wordArr2.filter(word => word.length >= queryLength && !(/(\/\*)[\s\S]*(\*\/)/.test(word)));
    await getWordFromServer(null, wordArr2);
    data = data.replace(regex2, ($0, $1) => {
      let word = $1;
      let id = wordMap.get(word);
      if (id) {
        return `{intl('${id}'/* ${word} */)}`;
      }

      return $0;
    });
  }

  if (filePath) {
    let imports = data.match(/import [\S ]+? from [\S ]+?;/g);
    let hasIntl = /import {? ?intl /.test(data);
    if (intlPath && imports && imports.length && !hasIntl && wordMap.size) {
      let lastImport = imports[imports.length - 1];
      let lines = [];
      // 计算导入 intl 文件的相对路径
      let relativeIntlPath = path.relative(filePath, intlPath);
      let dotArr = relativeIntlPath.match(/\.\./g);
      if (dotArr && dotArr.length === 1) {
        relativeIntlPath = relativeIntlPath.replace('..\\', './');
      }
      let backslashArr = relativeIntlPath.match(/\\/g);
      if (backslashArr && backslashArr.length) {
        backslashArr.forEach((val, index) => {
          if (index === 0 && dotArr && dotArr.length !== 1) {
            relativeIntlPath = relativeIntlPath.replace('..\\', '');
          } else {
            relativeIntlPath = relativeIntlPath.replace('\\', '/');
          }
        });
      }

      lines.push(lastImport);
      lines.push(`import ${intlModule} from '${relativeIntlPath}';`);
      data = data.replace(lastImport, lines.join('\n'));
    }
  }

  // 检测遗漏并提示
  let dataWithoutAnnotation = data.replace(/\/\*(\s|.)*?\*\/|(?<!:)\/\/[^\n]*/g, '');// .replace(/(?<!:)\/\/[^\n]*/g,'');
  // console.log('去注释:',dataWithoutAnnotation);
  let wordsMiss = dataWithoutAnnotation.match(/([\u4e00-\u9fa5]+[^'"`<>\s]*|[^'"`<>\s]*[\u4e00-\u9fa5]+)/g);
  if (wordsMiss && wordsMiss.length) {
    wordsMiss = Array.from(new Set(wordsMiss));
    console.error(`${filePath}文件中如下中文可能遗漏:\n`, wordsMiss, '\n');
  }
  fs.writeFileSync(filePath, data);
  // console.log(`完成文件${filePath}翻译\n`);
}

/**
 * 获取文件中的词条id
 * @param {*待查找的文件内容} data
 */
function getIds(data) {
  // 查找id;
  let regex = /intl\('\d+s?'/g; // intl('digit s?')
  let idRegex = /\d+/; // 提取词条id的正则表达式
  let ids = data.match(regex);
  if (ids && ids.length) {
    for (let i = 0; i < ids.length; i += 1) {
      let id = ids[i].match(idRegex);
      idsFound.add(id[0]);
    }
  }
}

/**
 * 读取文件
 * @param {*传入的文件名} fileName
 */
function readFile(fileName) {
  if (isLegalFile(fileName)) {
    try {
      let data = fs.readFileSync(fileName, 'utf8');
      if (argument === 'printIds') {
        getIds(data);
      } else if (argument === 'wordToId') {
        convertToId(data, fileName);
      }
    } catch (err) {
      console.error(`读取文件${fileName}发生错误：`, err);
    }
  }
}

/**
 * 递归读取文件
 * @param {*传入的文件目录} fileName
 */
function recursiveReadFile(fileName) {
  if (isFile(fileName)) {
    readFile(fileName);
  }
  if (isDirectory(fileName)) {
    let files = fs.readdirSync(fileName);
    files.forEach((val) => {
      let temp = path.join(fileName, val);
      if (isLegalPath(temp)) {
        if (isDirectory(temp)) recursiveReadFile(temp);
        if (isFile(temp)) readFile(temp);
      }
    });
  }
}

/**
 * 排序的比较函数
 * @param {*比较值a} a
 * @param {*比较值b} b
 */
function sortNumber(a, b) {
  return a - b;
}

/**
 * 处理单引号
 * @param {传入的字符串} str
 */
function dealSingleQuot(str) {
  return str.replace(/'/g, '\\\'');
}

/**
 * 将提取的词条id添加到config.js文件的ids数组中
 * @param {*从指定目录下提取到的词条id} ids
 */
function addConfigId(ids) {
  if (ids && ids.length) {
    let filePath = path.join(__dirname, 'config.js');
    let fileData = fs.readFileSync(filePath, 'utf8');
    fileData = fileData.replace(/const [\s\S]+?]/, () => {
      let lines = [];
      lines.push('const ids = [');
      ids.forEach((item) => {
        lines.push(`  '${dealSingleQuot(item)}',`);
      });
      lines.push(']');
      return lines.join('\n');
    });
    fs.writeFileSync(filePath, fileData);
  }
}

/**
 * 打印出按数值升序排列的词条id
 */
function printIds() {
  if (!fs.existsSync(basePath)) {
    console.log('不存在指定的文件目录，请重新设置basePath！');
    return;
  }

  if (!fileType || !fileType.length) {
    console.log('请设置提取词条id文件类型的值fileType！');
    return;
  }
  addIllegalPath(basePath);
  recursiveReadFile(basePath);
  let ascIds = Array.from(idsFound);
  ascIds.sort(sortNumber);
  addConfigId(ascIds);
  console.log(`${basePath}目录下指定文件类型文件的词条id已加入到config.js文件中的ids数组中！`, '\r');
}

function wordToId() {
  if (!fs.existsSync(basePath)) {
    console.log('不存在指定的文件目录，请重新设置basePath！');
    return;
  }

  if (!fileType || !fileType.length) {
    console.log('请设置词条文件类型的值fileType！');
    return;
  }
  addIllegalPath(basePath);
  recursiveReadFile(basePath);
  // console.log(`${basePath}目录下指定文件类型文件的词条已替换为id的形式！`, '\r');
}


/**
 * 词条写入locale多语言源文件
 * @param {*词条Map} wordItems
 * @param {*文件路径} filePath
 * @param {*文件名称} lang
 */
function print(wordItems, filePath, lang) {
  if (wordItems == null || wordItems.size <= 0) {
    console.log(`配置文件ids、extraIds无值，相关文件：${filePath}未再次生成.`);
    return;
  }

  if (filePath == null) {
    console.log('参数path无值.');
    return;
  }

  if (langs[lang] == null) {
    console.log(`参数lang:${lang}不正确.`);
    return;
  }

  fs.writeFileSync(filePath, '');
  let wordsKeys = [...wordItems.keys()];
  wordsKeys.sort(sortNumber);
  if (localeIsJSON) {
    fs.appendFileSync(filePath, '[\n');

    wordsKeys.forEach((item, index) => {
      let word = wordItems.get(item);
      fs.appendFileSync(filePath, '  {\n');
      fs.appendFileSync(filePath, `    "ID": ${word.ID},\n`);
      fs.appendFileSync(filePath, `    "FullStr": "${lang === 'en' ? dealSingleQuot(word.ENFULLNAME) : dealSingleQuot(word.CHFULLNAME)}"\n`);
      if (index === wordsKeys.length - 1) {
        fs.appendFileSync(filePath, '  }\n');
      } else {
        fs.appendFileSync(filePath, '  },\n');
      }
    });

    fs.appendFileSync(filePath, ']');
  } else {
    fs.appendFileSync(filePath, 'export default { \n');

    wordsKeys.forEach((item) => {
      let word = wordItems.get(item);
      fs.appendFileSync(filePath, `  '${word.ID}': '${lang === 'en' ? dealSingleQuot(word.ENFULLNAME) : dealSingleQuot(word.CHFULLNAME)}',\n`);
    });

    fs.appendFileSync(filePath, '}');
  }
  console.log(`多语言源文件<${filePath}>生成完毕！`);
}

/**
 * 根据ids生成locale文件的入口函数
 */
async function intlToLocale() {
  let ids;
  if (config.ids && config.ids.length) {
    ids = config.ids;
    if (config.extraIds && config.extraIds.length) {
      // ids和extraIds合并、去重、排序
      ids = [...ids, ...config.extraIds];
      let idsSet = new Set(ids);
      ids = [...idsSet];
      ids.sort(sortNumber);
    }

    // 自动去站点获取id
    await getWordFromServer(ids);
  } else if (config.extraIds && config.extraIds.length) {
    // extraIds去重、排序
    ids = [...config.extraIds];
    let idsSet = new Set(ids);
    ids = [...idsSet];
    ids.sort(sortNumber);

    // 自动去站点获取id
    await getWordFromServer(ids);
  }

  // 输出 locale 文件
  if (path) {
    let directory = path.join(__dirname, localeDirectory);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log(`成功创建<${directory}>目录！`);
    }
    let filePath = path.join(__dirname, localeDirectory, localeIsJSON ? `${langs.cn.replace('-', '_')}.json` : `${langs.cn.replace('-', '_')}.js`);
    print(words, filePath, 'cn');
    filePath = path.join(__dirname, localeDirectory, localeIsJSON ? `${langs.en.replace('-', '_')}.json` : `${langs.en.replace('-', '_')}.js`);
    print(words, filePath, 'en');
    console.log('\r');
  }
}


/**
 * 执行入口
 */
if (argument === 'printIds') {
  // 将提取的词条id添加到config.js文件的ids数组中
  printIds();
} else if (argument === 'writeLocale') {
  // 根据词条id(config.ids和config.extraIds)将词条写入locale多语言源文件
  intlToLocale();
} else if (argument === 'wordToId') {
  // 将指定目录下的中文词条替换为词条id和中文注释
  wordToId();
}
