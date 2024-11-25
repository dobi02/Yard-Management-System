import React, { useEffect } from 'react';
import { Card, Button, Select, message, Form, Input } from 'antd';
import MainLayout from "../../pages/AdminLayout";
import './AdminDashboard.css';
import axios from 'axios';

const { Option } = Select;

const AdminDashboard = () => {
    const [form] = Form.useForm(); // Form 객체 생성

    const [selectedDivision, setSelectedDivision] = React.useState(null); //
    const [selectedYard, setSelectedYard] = React.useState(null);
    const [divisions, setDivisions] = React.useState([]); // 디비전 목록
    const [yards, setYards] = React.useState([]); // 디비전의 야드 목록
    const [assets, setAssets] = React.useState([]); // 야드의 장비 목록

    // 컴포넌트 처음 렌더링할 때 디비전 목록을 불러옴
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                // 디비전 목록 호출 API
                const response = await axios.get("http://localhost:8000/api/divisions/");
                setDivisions(response.data); // 디비전 목록
            } catch (error) {
                message.error("Failed to load divisions");
            }
        };

        fetchDivisions();
    }, []);

    // 디비전 선택 야드 불러오기
    const handleDivisionChange = async (value) => {
        setSelectedDivision(value);
        try {
            // 디비전의 야드 목록 호출 API
            const response = await axios.get("http://localhost:8000/");
            setYards(response.data); // 야드 목록
        } catch (error) {
            message.error("Failed to load yards");
        }
    }
    // 야드 선택 장비 불러오기
    const handleYardChange = async (value) => {
        setSelectedYard(value);
        try {
            // 야드의 장비 호출 API
            const response = await axios.get("http://localhost:8000/");
            setAssets(response.data);
        } catch (error) {
            message.error('Failed to load assets');
        }
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
            {/* 디비전, 야드 선택 */}
            <div className="select-container">
                {/* 디비전 선택 */}
                <Select
                    placeholder="Select Division"
                    style={{width: 150, marginRight: 10}}
                    onChange={handleDivisionChange}
                >
                    {divisions.map((division) => (
                        <Option key={division.division_id} value={division.division_id}>
                            {division.division_id}
                        </Option>
                    ))}
                </Select>
                {/* 야드 선택 */}
                <Select
                    placeholder="Select Yard"
                    style={{width: 150}}
                    onChange={handleYardChange}
                    disabled={!selectedDivision}
                >
                    {yards.map((yard) => (
                        <Option key={yard.yard_id} value={yard.yard_id}>
                            {yard.yard_id}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* 정보 카드 */}
            <div className="cards-container" style={{marginTop: '16px'}}>
                {assets.length > 0 ? (
                    assets.map((info, index) => (
                        <Card key={index} title={info.name} bordered={false} className="info-card">
                            <p>{info.description}</p>
                        </Card>
                    ))
                ) : (
                    <Card title="None" bordered={false} className="info-card">
                        <p>No assets</p>
                    </Card>
                )}
            </div>

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
            <div className="equipment-management" style={{marginTop: '30px'}}>
                <h2>Equipment Management</h2>
                <div style={{marginBottom: '20px'}}>
                    <Select
                        defaultValue="trucks"
                        style={{width: 200, marginRight: 10}}
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
                        rules={[{required: true, message: 'Please enter an ID!'}]}
                    >
                        <Input placeholder="Equipment ID"/>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        rules={[{required: true, message: 'Please enter a type!'}]}
                    >
                        <Input placeholder="Type/Size"/>
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
                                style={{color: 'red'}}
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