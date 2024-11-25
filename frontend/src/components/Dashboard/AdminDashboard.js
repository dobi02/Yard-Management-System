import React from 'react';
import { Card, Row, Col, Button, Select } from 'antd';
import MainLayout from "../../pages/AdminLayout";
import './AdminDashboard.css';

const { Option } = Select;

const AdminDashboard = () => {
    const [selectedDivision, setSelectedDivision] = React.useState(null);
    const [selectedYard, setSelectedYard] = React.useState(null);

    const handleDivisionChange = (value) => {
        setSelectedDivision(value);
    };

    const handleYardChange = (value) => {
        setSelectedYard(value);
    };

    return (
        <MainLayout>
            <div className="select-container">
                <Select defaultValue={selectedDivision} style={{width: 120, marginRight: 10}}
                        onChange={handleDivisionChange}>
                    <Option value="LA">LA</Option>
                    <Option value="PHX">PHX</Option>
                </Select>
                <Select defaultValue={selectedYard} style={{width: 120}} onChange={handleYardChange}>
                    <Option value="LA01">LA01</Option>
                    <Option value="LA02">LA02</Option>
                </Select>
            </div>
            <Row gutter={[16, 16]} style={{marginTop: '16px'}}>
                <Col span={8}>
                    <Card title="Total Trucks" bordered={false}> {/* 총 트럭 수 카드 */}
                        <p>27 Active in yard</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Available Spaces" bordered={false}> {/* 사용 가능한 공간 카드 */}
                        <p>45 Across all sites</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Daily Operations" bordered={false}> {/* 일일 작업 카드 */}
                        <p>152 Last 24 hours</p>
                    </Card>
                </Col>
            </Row>
            <div className="yard-layout" style={{marginTop: '30px'}}> {/* 야드 레이아웃 섹션 */}
                <h2>Yard Layout</h2>
                <p>Current status and occupancy of yard spaces</p>
                <Button type="default">Map View</Button> {/* 지도 보기 버튼 */}
                <Button type="default" style={{marginLeft: '10px'}}>List View</Button> {/* 목록 보기 버튼 */}
                <div className="yard-map-placeholder" style={{marginTop: '20px'}}> {/* 야드 맵 자리 표시자 */}
                    Yard map visualization will be implemented here
                </div>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;