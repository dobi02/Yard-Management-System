import React from 'react';
import './DriverDashboard.css'
import DriverLayout from "./DriverLayout";

import { Card, List, Space, Button } from "antd-mobile";
import { AppstoreOutline, EnvironmentOutline } from "antd-mobile-icons";



const DriverDashboard = () => {

    return (
        <DriverLayout>
            <div className="dashboard-container">
                {/* Pending Trip Requests */}
                <Card className="dashboard-card">
                    <h3>Pending Trip Orders</h3>
                    <div className="list-item">
                        <span className="list-item-icon">📋</span>
                        <span className="list-item-text">예정 주문</span>
                    </div>
                </Card>

                {/* Ongoing Trip */}
                <Card className="dashboard-card">
                    <h3>Ongoing Trip</h3>
                    <div className="list-item">
                        <span className="list-item-icon">
                            <EnvironmentOutline/>
                        </span>
                        <span className="list-item-key">From:</span>
                        <span className="list-item-text">여기에서</span>
                    </div>
                    <div className="list-item">
                        <span className="list-item-icon">
                            <EnvironmentOutline/>
                        </span>
                        <span className="list-item-key">To:</span>
                        <span className="list-item-text">여기로</span>
                    </div>
                    <div className="list-item">
                        <span className="list-item-icon">📏</span>
                        <span className="list-item-key">Distance Left:</span>
                        <span className="list-item-text">10 km</span>
                    </div>
                </Card>

                {/* Key Statistics */}
                <Card className="dashboard-card">
                    <h3>Key Statistics</h3>
                    <div className="list-item">
                        <span className="list-item-icon">✔️</span>
                        <span className="list-item-key">Completed Trips:</span>
                        <span className="list-item-text">15</span>
                    </div>
                    <div className="list-item">
                        <span className="list-item-icon">📦</span>
                        <span className="list-item-key">Total Transported:</span>
                        <span className="list-item-text">200 Tons</span>
                    </div>
                </Card>

                {/* Shortcuts */}
                <Space className="dashboard-buttons">
                    <div className="shortcut-button">바로가기</div>
                    <div className="shortcut-button">?????</div>
                </Space>
            </div>
        </DriverLayout>
    );
};

export default DriverDashboard;