import React, { useState } from "react";
import { TabBar, NavBar } from "antd-mobile";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    UnorderedListOutline,
    FileOutline ,
    BellOutline,
    SetOutline,
    MailOutline
} from 'antd-mobile-icons';
import "./DriverLayout.css";


const DriverLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // 사이드바 접힙 설정

    return (
        <div className="driver-layout">
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
                        <li>
                            <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 메인 화면 */}
            <div className="content">
                {children}
            </div>

            {/* 하단 메뉴 */}
            <TabBar
                className="tabbar"
                activeKey={location.pathname}
                onChange={(key) => navigate(key)}
            >
                <TabBar.Item key="/driver/dashboard" icon={<FileOutline />} title="Dashboard" />
                <TabBar.Item key="/driver/orders" icon={<BellOutline />} title="Orders" />
                <TabBar.Item key="/driver/notifications" icon={<MailOutline />} title="Notifications" />
                <TabBar.Item key="/driver/settings" icon={<SetOutline />} title="Settings" />
            </TabBar>
        </div>
    );
};

export default DriverLayout;
