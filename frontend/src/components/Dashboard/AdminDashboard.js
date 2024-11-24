import React from 'react';
import { Card, Row, Col, Button, Select, message, Form, Input } from 'antd';
import MainLayout from "../../pages/AdminLayout";
import './AdminDashboard.css';
import axios from 'axios';

const { Option } = Select;

const AdminDashboard = () => {
    const [form] = Form.useForm(); // Form 객체 생성

    const [selectedDivision, setSelectedDivision] = React.useState(null);
    const [selectedYard, setSelectedYard] = React.useState(null);

    const handleDivisionChange = (value) => {
        setSelectedDivision(value);
    };

    const handleYardChange = (value) => {
        setSelectedYard(value);
    };

    const [equipmentType, setEquipmentType] = React.useState('trucks');
    const [equipmentList, setEquipmentList] = React.useState([]);

    // 장비 추가 요청
    const handleAddEquipment = async (values) => {
        if (!selectedYard) {
            message.error('Please select a yard first!');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/${equipmentType}/`, {
                ...values,
                yard: selectedYard, // 선택된 야드 추가
            });
            message.success('Equipment added successfully');
            setEquipmentList([...equipmentList, response.data]);
            form.resetFields();
        } catch (error) {
            message.error('Failed to add equipment');
        }
    };

    // 장비 삭제 요청
    const handleDeleteEquipment = async (id) => {
        if (!selectedYard) {
            message.error('Please select a yard first!');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/${equipmentType}/${id}/`, {
                data: { yard: selectedYard }, // 선택된 야드 전달
            });
            message.success('Equipment deleted successfully');
            setEquipmentList(equipmentList.filter((item) => item.id !== id));
        } catch (error) {
            message.error('Failed to delete equipment');
        }
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

            {/* 장비 관리 기능 */}
            <div className="equipment-management" style={{ marginTop: '30px' }}>
                <h2>Equipment Management</h2>
                <div style={{ marginBottom: '20px' }}>
                    <Select
                        defaultValue="trucks"
                        style={{ width: 200, marginRight: 10 }}
                        onChange={setEquipmentType}
                    >
                        <Option value="trucks">Trucks</Option>
                        <Option value="chassis">Chassis</Option>
                        <Option value="trailers">Trailers</Option>
                        <Option value="containers">Containers</Option>
                    </Select>
                </div>
                <Form
                    form={form}
                    name="add-equipment"
                    layout="inline"
                    onFinish={handleAddEquipment}
                >
                    <Form.Item
                        name="id"
                        rules={[{ required: true, message: 'Please enter an ID!' }]}
                    >
                        <Input placeholder="Equipment ID" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        rules={[{ required: true, message: 'Please enter a type!' }]}
                    >
                        <Input placeholder="Type/Size" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Equipment
                        </Button>
                    </Form.Item>
                </Form>
                <ul>
                    {equipmentList.map((item) => (
                        <li key={item.id}>
                            {item.id} - {item.type}
                            <Button
                                type="link"
                                style={{ color: 'red' }}
                                onClick={() => handleDeleteEquipment(item.id)}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;