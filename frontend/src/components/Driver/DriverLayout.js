import React, { useState } from "react";
import { TabBar, NavBar } from "antd-mobile";
import {
    UnorderedListOutline,
    FileOutline ,
    BellOutline,
    SetOutline,
    MailOutline
} from 'antd-mobile-icons';
import "./DriverLayout.css";
import DriverDashboard from "./DriverDashboard";


const DriverLayout = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState('dashboard'); // 하단 탭
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // 사이드바 접힙 설정

    // 각 버튼 별 경로 설정
    const renderContent = (tab) => {
        switch (tab) {
            case 'dashboard':
                return <DriverDashboard />;
            case 'orders':
                return null;
            case 'notifications':
                return null;
            case 'settings':
                return null;
            default:
                return null;
        }
    }


    return (
        <div className="driver=layout">
            {/* 상단 바 */}
            <NavBar
                className="navbar"
                left={
                <UnorderedListOutline
                    className="navbar-icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
                back={null}
            >
                YMS
            </NavBar>

            {/* 사이드 바 */}

            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <ul>
                    <li onClick={() => { setSelectedTab('settings'); setIsSidebarOpen(false); }}>Settings</li>
                    </ul>
                </div>
            </div>

            {/* 메인 화면 */}
            <div className="content">
                {children ? children : renderContent(selectedTab)}
            </div>

            {/* 하단 메뉴 */}
            <TabBar className="tabbar"
                activeKey={selectedTab}
                onChange={(key) => setSelectedTab(key)}
                safeArea
            >
                <TabBar.Item
                    key="dashboard"
                    icon={<FileOutline />}
                    title="Dashboard"
                />
                <TabBar.Item
                    key="orders"
                    icon={<BellOutline />}
                    title="Orders"
                />
                <TabBar.Item
                    key="notifications"
                    icon={<MailOutline />}
                    title="Notifications"
                />
                <TabBar.Item
                    key="settings"
                    icon={<SetOutline />}
                    title="Settings"
                />
            </TabBar>
        </div>
    );
};

export default DriverLayout;
