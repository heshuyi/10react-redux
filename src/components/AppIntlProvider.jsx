import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { LocaleProvider } from '@wind/wind-ui';
import { client } from '@wind/windjs';
import enUSui from '@wind/wind-ui/lib/locale-provider/en_US';
import intl, { getLocale, getLang } from '../utils/intl';
import zhCN from '../locale/zh_CN';
import enUS from '../locale/en_US';


let locale;
let localUI;

const locales = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

// 终端多语言设置修改时会触发 ServerFunc(func = NotifyLocaleChanged)
// 使用 addServerFunc 避免直接覆盖 window.ServerFunc 导致冲突
client.addServerFunc('NotifyLocaleChanged', () => {
  // console.log('NotifyLocaleChanged', params);
  window.location.reload();
});

function init() {
  let lang = getLang(getLocale());
  switch (lang) {
    case 'en':
      locale = 'en-US';
      localUI = enUSui;
      moment.locale('en');
      break;
    case 'zh':
    default:
      locale = 'zh-CN';
      localUI = null;
      moment.locale('zh-cn');
      break;
  }

  return intl.init({
    currentLocale: locale,
    locales,
    commonLocaleDataUrls: {
      // index.html相对的路径
      en: 'assets/js/react-intl-universal/en.js',
      zh: 'assets/js/react-intl-universal/zh.js',
    },
  });

  // 异步载入多语言文件(记得注释上面import的多语言资源)
  // return import(`../locale/${locale.replace('-', '_')}.js`)
  //   .then(data => intl.init({
  //     currentLocale: locale,
  //     locales: {
  //       [locale]: data.default,
  //     },
  //     commonLocaleDataUrls: {
  //     // index.html相对的路径
  //       en: 'assets/js/react-intl-universal/en.js',
  //       zh: 'assets/js/react-intl-universal/zh.js',
  //     },
  //   }));
}

const promiseInit = init();

class AppIntlProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
    };
  }

  componentDidMount() {
    // 若lang资源文件要异步加载，则加载的时机会变迟,intl.get尽量不要在声明中直接调用
    promiseInit.then(() => {
      this.setState({
        initDone: true,
      });
    });
  }

  render() {
    const { initDone } = this.state;
    const { children } = this.props;
    return (initDone
      && (
        <LocaleProvider locale={localUI}>
          {children}
        </LocaleProvider>
      ));
  }
}

AppIntlProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppIntlProvider;
