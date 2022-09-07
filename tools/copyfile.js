/**
 * @summary
 * 首先清空除白名单(WHITE_LIST)以外的目标文件夹(TARGET_DIR)里面的内容；
 * 然后扫描源文件夹(BASE_DIR)，复制除白名单以外的内容至目标文件夹。
 */

const path = require('path');
const fs = require('fs');

const BASE_DIR = path.join(__dirname, '../build'); // 源文件夹
const TARGET_DIR = ''; // 目标文件夹，根据需求设置

const WHITE_LIST = ['.svn'];

let deleteFileNumber = 0;
let copyFileNumber = 0;
function unlinkFile(filePath) {
  console.log('删除文件: ', filePath);
  deleteFileNumber += 1;
  fs.unlinkSync(filePath);
}

function copyFile(sourcePath, targetPath) {
  console.log('copy file to: ', targetPath);
  copyFileNumber += 1;
  fs.copyFileSync(sourcePath, targetPath);
}

function scanDirAndRemove(sourceDir) {
  try {
    let files = fs.readdirSync(sourceDir);
    let filesLength = files.length;
    if (filesLength === 0) return;

    for (let i = 0; i < filesLength; i += 1) {
      let file = files[i];
      if (!WHITE_LIST.includes(file)) {
        let totalPath = path.join(sourceDir, file);
        let isDir = fs.statSync(totalPath).isDirectory();
        if (isDir) {
          scanDirAndRemove(totalPath);
        } else {
          unlinkFile(totalPath);
        }
      }
    }
  } catch (error) {
    console.log('扫描或移除文件失败');
    throw error;
  }
}

function scanDirAndCopyFile(sourcePath, targetPath) {
  try {
    let files = fs.readdirSync(sourcePath);
    let filesLength = files.length;
    if (filesLength === 0) return;

    for (let i = 0; i < filesLength; i += 1) {
      let file = files[i];
      if (!WHITE_LIST.includes(file)) {
        let fileSourcePath = path.join(sourcePath, file);
        let fileTargetPath = path.join(targetPath, file);
        let isDir = fs.statSync(fileSourcePath).isDirectory();
        if (isDir) {
          let exist = fs.existsSync(fileTargetPath);
          if (!exist) {
            fs.mkdirSync(fileTargetPath);
            console.log('创建目录: ', fileTargetPath);
          }
          scanDirAndCopyFile(fileSourcePath, fileTargetPath);
        } else {
          copyFile(fileSourcePath, fileTargetPath);
        }
      }
    }
  } catch (error) {
    console.log('扫描或拷贝文件失败');
    throw error;
  }
}

function copy() {
  if (TARGET_DIR === '') {
    console.log('请设置目标文件夹路径<TARGET_DIR>的值！');
    return;
  }
  if (!fs.existsSync(TARGET_DIR)) {
    try {
      console.log('创建目录: ', TARGET_DIR);
      fs.mkdirSync(TARGET_DIR, { recursive: true });
    } catch (error) {
      console.error(`创建目录 ${TARGET_DIR} 失败，请设置合法的<TARGET_DIR>目录！`);
      throw error;
    }
  }

  console.log('开始拷贝！');
  scanDirAndRemove(TARGET_DIR);
  console.log('删除文件数: ', deleteFileNumber);
  scanDirAndCopyFile(BASE_DIR, TARGET_DIR);
  console.log('拷贝文件数: ', copyFileNumber);
  console.log('拷贝完成！');
}

copy();
