import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Form, Input, Modal, message } from 'antd';
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
    const [equipmentType, setEquipmentType] = React.useState('trucks');
    const [equipmentList, setEquipmentList] = React.useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 장비 추가 팝업 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 장비 삭제 팝업 상태

    // 컴포넌트 처음 렌더링할 때 디비전 목록을 불러옴
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                // 디비전 목록 호출 API
                const response = await axios.get("http://localhost:8000/places/divisions/");
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
            const response = await axios.get(`http://localhost:8000/places/yards/${value}`);
            setYards(response.data); // 야드 목록
        } catch (error) {
            message.error("Failed to load yards");
        }
    }

    // 선택된 야드의 장비 목록 가져오기
    const fetchAssets = async (yardId) => {
        try {
            const response = await axios.get(`/api/yards/${yardId}/equipment-count/`);
            setAssets(response.data);

            // 삭제용 장비 목록 준비
            const list = [];
            if (response.data.truck) list.push({ id: 'truck', count: response.data.truck });
            if (response.data.chassis) list.push({ id: 'chassis', count: response.data.chassis });
            if (response.data.container) list.push({ id: 'container', count: response.data.container });
            if (response.data.trailer) list.push({ id: 'trailer', count: response.data.trailer });
            setEquipmentList(list);
        } catch (error) {
            message.error('Failed to fetch equipment count');
        }
    };

    // 야드 선택 장비 불러오기
    const handleYardChange = async (value) => {
        setSelectedYard(value);
        fetchAssets(value);
    };

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
            form.resetFields();
            setIsAddModalOpen(false); // 팝업 닫기
            fetchAssets(selectedYard); // 데이터 갱신
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
            setIsDeleteModalOpen(false); // 팝업 닫기
            fetchAssets(selectedYard); // 데이터 갱신
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

                {/* 장비 추가 버튼 */}
                <Button type="primary" style={{ marginRight: 10, marginLeft: '20px' }} onClick={() => setIsAddModalOpen(true)}>
                    Add Equipment
                </Button>

                {/* 장비 삭제 버튼 */}
                <Button type="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Equipment
                </Button>
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



            {/* 장비 추가 모달 */}
            <Modal
                title="Add Equipment"
                visible={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddEquipment}>
                    <Form.Item
                        name="id"
                        label="Equipment ID"
                        rules={[{ required: true, message: 'Please enter equipment ID!' }]}
                    >
                        <Input placeholder="Enter equipment ID" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Equipment Type"
                        rules={[{ required: true, message: 'Please select equipment type!' }]}
                    >
                        <Select placeholder="Select type">
                            <Option value="truck">Truck</Option>
                            <Option value="chassis">Chassis</Option>
                            <Option value="container">Container</Option>
                            <Option value="trailer">Trailer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add Equipment
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 장비 삭제 모달 */}
            <Modal
                title="Delete Equipment"
                visible={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={null}
            >
                <Select
                    placeholder="Select Equipment to Delete"
                    style={{ width: '100%', marginBottom: 20 }}
                    onChange={(value) => handleDeleteEquipment(value)}
                >
                    {equipmentList.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.id} ({item.count} Units)
                        </Option>
                    ))}
                </Select>
            </Modal>
        </MainLayout>
    );
};

export default AdminDashboard;