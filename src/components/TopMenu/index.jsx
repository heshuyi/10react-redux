import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu, Layout } from '@wind/wind-ui';
import Logo from './logo.png';
import './style.less';

function TopMenu({ location }) {
  const pathname = location.pathname === '/' ? '/home' : location.pathname;
  return (
    <Layout.Header theme="dark" className="top-menu">
      <Menu theme="dark" size="large" mode="horizontal" selectedKeys={[pathname]}>
        <Menu.Item key="/home">
          <Link to="/home">语言列表</Link>
        </Menu.Item>
        <Menu.Item key="/todo">
          <Link to="/todo">显示列表</Link>
        </Menu.Item>
        <Menu.Item key="/chart">
          <Link to="/chart">表单</Link>
        </Menu.Item>
      </Menu>
      <img className="logo" src={Logo} alt="logo" />
    </Layout.Header>
  );
}

TopMenu.propTypes = {
  location: PropTypes.object.isRequired,
};

// widthRouter 为组件提供路由相关参数 location,history,match
export default withRouter(TopMenu);
