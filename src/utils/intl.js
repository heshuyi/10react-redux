import intlU from 'react-intl-universal';
import { getSyscfg } from './utils';

function intl(id, params) {
  return intlU.get(id, params);
}

// 获取多语言设置
function getLocale() {
  let locale = navigator.language; // 系统设置
  const { search } = window.location;
  const match = search.match(/[?|&]lang?=([^&]+)/);
  // url优先
  if (match && match[1]) {
    locale = match[1];
    let lang = locale.toLowerCase();
    if (lang === 'cn') {
      locale = 'zh-CN';
    } else if (lang === 'en') {
      locale = 'en-US';
    }
  } else {
    // 获取终端设置
    let cfg = getSyscfg();
    if (cfg && cfg.Lang) {
      locale = cfg.Lang === 'ENS' ? 'en-US' : 'zh-CN';
    }
  }
  return locale;
}

// 获取语言大类
function getLang(locale) {
  if (typeof locale === 'string') {
    return locale.split('-')[0];
  }
  return locale;
}

// 中文字符间不需要空，但英文单词间需要空
function getSpace(locale) {
  if (getLang(locale) === 'en') {
    return ' ';
  }
  return '';
}

Object.getOwnPropertyNames(intlU.constructor.prototype)
  .concat(Object.keys(intlU)).forEach((key) => {
    if (key !== 'constructor') {
      if (typeof intl[key] === 'function') {
        intl[key] = (...args) => intlU[key](...args);
      } else {
        intl[key] = intlU[key];
      }
    }
  });

intl.space = '';
intl.init = (options) => {
  let ret = intlU.init(options);
  intl.space = getSpace(intlU.options.currentLocale);
  return ret;
};

export { getLocale, getLang };

export default intl;
