import React from 'react';
import { Button } from 'antd';
import AdminLayout from "./AdminLayout";
import './YardLayout.css';
import axios from 'axios';


const YardLayout = () => {
    return (
        <AdminLayout>
            <div className="yard-layout" style={{marginTop: '30px'}}> {/* 야드 레이아웃 섹션 */}
                <h2>Yard Layout</h2>
                <p>Current status and occupancy of yard spaces</p>
                <Button type="default">Map View</Button> {/* 지도 보기 버튼 */}
                <Button type="default" style={{marginLeft: '10px'}}>List View</Button> {/* 목록 보기 버튼 */}
                <div className="yard-map-placeholder" style={{marginTop: '20px'}}> {/* 야드 맵 자리 표시자 */}
                    Yard map visualization will be implemented here
                </div>
            </div>
        </AdminLayout>
    );
};

export default YardLayout;