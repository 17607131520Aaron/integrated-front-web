import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';

import type { MenuProps } from 'antd';
import { Input, Layout, Menu } from 'antd';

import type { RootState } from '@/store';
import { setMenuData } from '@/store/userStore/userSlice';
import type { IMenuItem } from '@/types/base';

import { getSystemName } from './data';
import useLayout from './useLayout';

import './index.scss';

const { Header, Content, Sider } = Layout;

const LayoutPages: React.FC = () => {
  const dispatch = useDispatch();
  const userinfo = useSelector((state: RootState) => state.userInfo.userDetail);
  const routerState = useSelector((state: RootState) => state.userInfo.routerList);

  const { filterMenu, getSelectedKeys, setSearchText } = useLayout({
    routerState,
  });

  useEffect(() => {
    dispatch(setMenuData([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatMenuItems = (items: IMenuItem[]): MenuProps['items'] => {
    if (!items || items.length === 0) {
      return [];
    }
    return items.map(item => {
      return {
        key: item.id,
        label: item.children ? (
          item.title
        ) : item.path ? (
          <Link to={item.path}>{item.title}</Link>
        ) : (
          item.title
        ),
        title: item.title,
        icon: item.icon,
        children: item.children ? formatMenuItems(item.children) : undefined,
      };
    });
  };
  return (
    <div className="asp-comprehension-home">
      <Layout style={{ height: '100%', width: '100%' }}>
        <Sider collapsedWidth="0" width={220} theme="light">
          <div className="asp-comprehension-home-menu">
            <div className="asp-comprehension-home-menu-logo">
              {/* <img src={xmsImg} alt="" /> */}
              <span className="asp-comprehension-home-menu-logo-title">{getSystemName}</span>
            </div>
            <div className="asp-comprehension-home-menu-search">
              <Input
                variant="filled"
                placeholder="搜索"
                allowClear
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <div className="asp-comprehension-home-menu-content">
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={getSelectedKeys()}
                items={formatMenuItems(filterMenu(routerState))}
                defaultOpenKeys={routerState.map((item: IMenuItem) => item.id)}
              />
            </div>
          </div>
        </Sider>

        <Layout>
          <Header className="asp-comprehension-home-header">
            <div className="asp-comprehension-home-header-content">
              <div className="asp-comprehension-home-header-content-user">
                {/* <img src={userImg} alt="" /> */}
                <div>{userinfo?.name ?? 'admin'}</div>
              </div>
            </div>
          </Header>
          <Content>
            <div className="asp-comprehension-home-content">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default LayoutPages;
