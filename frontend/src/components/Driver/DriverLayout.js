import React from "react";
import { TabBar, NavBar } from "antd-mobile";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    FileOutline,
    UserCircleOutline
} from 'antd-mobile-icons';
import "./DriverLayout.css";
import {HomeOutlined} from "@ant-design/icons";



const DriverLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = useParams();

    return (
        <div className="driver-layout">
            {/* 상단 바 */}
            <NavBar
                className="navbar"
                back={null}
            >
                YMS
            </NavBar>

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
                <TabBar.Item
                    key={`/driver/${username}/dashboard`}
                    icon={<HomeOutlined />}
                    title="Dashboard"
                />
                <TabBar.Item
                    key={`/driver/${username}/transaction`}
                    icon={<FileOutline />}
                    title="Transaction"
                />
                <TabBar.Item
                    key={`/driver/${username}/settings`}
                    icon={<UserCircleOutline />}
                    title="settings"
                />
            </TabBar>
        </div>
    );
};

export default DriverLayout;
