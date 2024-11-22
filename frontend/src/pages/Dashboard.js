import React from 'react';
import { Layout, Menu, Card, Row, Col, Button, Select } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './Dashboard.css';

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const Dashboard = () => {
    const [selectedDivision, setSelectDivision] = React.useState('LA');
    const [selectedYard, setSelectYard] = React.useState('LA01');

    const handleDivisionChange = (value) => {
        setSelectDivision(value);
    };

    const handleYardChange = (value) => {
        setSelectYard(value);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}> {/* 전체 레이아웃, 화면 높이를 채우도록 설정 */}
            <Sider collapsible style={{ background: '#fff' }}> {/* 사이드바 레이아웃, 접을 수 있도록 설정 */}
                <div className="logo">YSM</div> {/* 로고 영역 */}
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline"> {/* 사이드 메뉴 */}
                    <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item> {/* 대시보드 메뉴 */}
                    <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item> {/* 설정 메뉴 */}
                    <Menu.Item key="3" icon={<LogoutOutlined />}>Logout</Menu.Item> {/* 로그아웃 메뉴 */}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}> {/* 헤더 영역 */}
                    <div className="site-header-title">Yard Overview</div>
                    {/* 헤더 제목 */}
                    <div className="select-container"> {/* 선택 영역 */}
                        <Select defaultValue={selectedDivision} style={{width: 120, marginRight: 10}}
                                onChange={handleDivisionChange}> {/* Division 선택 */}
                            <Option value="LA">LA</Option>
                            <Option value="PHX">PHX</Option>
                            <Option value="HOU">HOU</Option>
                            <Option value="SAV">SAV</Option>
                            <Option value="MOB">MOB</Option>
                        </Select>
                        <Select defaultValue={selectedYard} style={{width: 120}}
                                onChange={handleYardChange}> {/* Yard 선택 */}
                            <Option value="LA01">LA01</Option>
                            <Option value="LA02">LA02</Option>
                            <Option value="LA03">LA03</Option>
                            <Option value="LA04">LA04</Option>
                        </Select>
                    </div>
                </Header>
                <Content style={{margin: '16px'}}> {/* 메인 콘텐츠 영역 */}
                    <Row gutter={[16, 16]}> {/* 카드들을 가로로 배치, 간격 설정 */}
                        <Col span={8}> {/* 각 카드의 열 크기 설정 */}
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
                    <div className="Yard-layout"> {/* 야드 레이아웃 섹션 */}
                        <h2>Yard Layout</h2>
                        <p>Current status and occupancy of yard spaces</p>
                        <Button type="default">Map View</Button> {/* 지도 보기 버튼 */}
                        <Button type="default" style={{marginLeft: '10px'}}>List View</Button> {/* 목록 보기 버튼 */}
                        <div className="yard-map-placeholder"> {/* 야드 맵 자리 표시자 */}
                            Yard map visualization will be implemented here
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;