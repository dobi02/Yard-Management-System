// 관리자 사이드바 오버레이
// 위치마다 버튼 할성화 되어 있음

import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, SettingOutlined, EnvironmentOutlined, RetweetOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './ManagerLayout.css';

const { Header, Sider, Content } = Layout;

const items = [
    // dashboard
  {
    key: '/manager/dashboard',
    icon: <DashboardOutlined />,
    label: (<Link to="/manager/dashboard">Dashboard</Link>),
  },
    // yard layout
  {
    key: '/manager/yardlayout',
    icon: <EnvironmentOutlined />,
    label: (<Link to="/manager/yardlayout">Yard Layout</Link>),
  },
  // transaction layout
   {
    key: '/manager/transactions',
    icon: <RetweetOutlined />,
    label: (<Link to="/manager/transactions">In/Out Transactions</Link>),
  },
    // settting
  {
    key: '/manager/settings',
    icon: <SettingOutlined />,
    label: (<Link to="/manager/settings">Settings</Link>),
  },
  // test
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
    { key: '/admin/test', icon: <ExperimentOutlined />, label: <Link to="/admin/test">Test Dashboard</Link> },
    { key: '/admin/settings', icon: <SettingOutlined />, label: <Link to="/admin/settings">Settings</Link> },
];


const ManagerLayout = ({ children }) => {
  const location = useLocation(); // 현재 위치 확인
  const [collapsed, setCollapsed] = useState(false); // 사이드바 접힘 관리

  const onCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed); // 사이드바 접힘 상태 업데이트
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}> {/* 전체 레이아웃, 화면 높이를 채우도록 설정 */}
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ background: '#fff' }}> {/* 사이드바 레이아웃, 접을 수 있도록 설정 */}
        <div className="manager-logo">YMS</div> {/* 로고 영역 */}
        <Menu mode="inline" items={items} selectedKeys={[location.pathname]} /> {/* 사이드 메뉴 */}
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" > {/* 헤더 영역 */}
          <div className="site-header-title">
            {location.pathname === '/manager/transactions' ? 'In/Out Transactions' : 'Admin Page'}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}> {/* 메인 콘텐츠 영역 */}
          {children} {/* 페이지에 따른 다른 콘텐츠 렌더링 */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
