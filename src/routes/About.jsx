import React from 'react';
import { Button, DatePicker, Pagination } from '@wind/wind-ui';
import { client, utils } from '@wind/windjs';
import { HomeO, SearchO } from '@wind/icons';
// import HomeO from '@wind/icons/lib/icons/HomeO';
// import SearchO from '@wind/icons/lib/icons/SearchO';
import intl from '../utils/intl';

function handleVersion() {
  client.doFunc({ func: 'querydata', isGlobal: '1', name: 'version' }).then((ret) => {
    if (ret.result) { // "20.5.0.14434 [2020-07-10]"
      let version = ret.result.substring(0, ret.result.indexOf(' ['));
      if (utils.versionCompare(version, '20.5.0.14433'/* 版本号未定 */) > 0) {
        // 新版本终端，支持isFunctionLimited
        // console.log('clientFunc isFunctionLimited is supported');
      } else {
        // console.log('clientFunc isFunctionLimited is not supported');
      }
    }
  });
}

const About = () => (
  <div style={{ padding: 20 }}>
    <a target="_blank" rel="noopener noreferrer" href="http://10.102.17.181:8001/"> Wind Design</a>
    <div className="f-mt-sm">
      {intl('23202'/* 交易日测试 */)}
      {' '}
      <DatePicker />
    </div>
    <div className="f-mt-sm"><Pagination defaultCurrent={1} total={50} showSizeChanger /></div>
    <br />
    <div>
      <h2>wind icons测试</h2>
      <span className="icons-list" style={{ fontSize: 16 }}>
        测试
        <HomeO />
        123
      </span>
      <Button onClick={handleVersion}>
        <SearchO />
        搜索
      </Button>
    </div>
  </div>
);

export default About;
