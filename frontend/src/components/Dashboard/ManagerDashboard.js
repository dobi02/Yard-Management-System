import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Form, Input, Modal, message } from 'antd';
import ManagerLayout from "./ManagerLayout";
import './ManagerDashboard.css';
import axios from 'axios';

const { Option } = Select;

const ManagerDashboard = () => {
    const [form] = Form.useForm(); // Form 객체 생성

    const [selectedDivision, setSelectedDivision] = useState(null); //
    const [selectedYard, setSelectedYard] = useState(null);
    const [divisions, setDivisions] = useState([]); // 디비전 목록
    const [yards, setYards] = useState([]); // 디비전의 야드 목록
    const [sites, setSites] = useState([]);
    const [assets, setAssets] = useState([]); // 야드의 장비 목록

    const [equipmentType, setEquipmentType] = useState('trucks');
    const [equipmentList, setEquipmentList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 장비 추가 팝업 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 장비 삭제 팝업 상태

    // 컴포넌트 처음 렌더링할 때 디비전 목록을 불러옴
     useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/places/divisions/`);
                setDivisions(response.data);
            } catch (error) {
                message.error('Failed to load divisions');
            }
        };
        fetchDivisions();
    }, []);

    // 디비전 선택 야드 불러오기
    const handleDivisionChange = async (value) => {
        setSelectedDivision(value);
        try {
            // 디비전의 야드 목록 호출 API
            const response = await axios.get(`http://localhost:8000/places/yards/`);
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
      const handleYardChange = async (yardId) => {
        setSelectedYard(yardId);
        try {
            const response = await axios.get(`http://localhost:8000/places/sites/${yardId}/`);
            setSites(response.data);
        } catch (error) {
            message.error('Failed to load sites');
        }
    };


    // 장비 추가 요청
    const handleAddEquipment = async (values) => {
        try {
            const maxCapacity = assets.find((asset) => asset.name === equipmentType)?.maxCapacity || 0;
            const currentCount = assets.find((asset) => asset.name === equipmentType)?.count || 0;

            if (currentCount + values.quantity > maxCapacity) {
                message.error(`Cannot add more than ${maxCapacity} units of ${equipmentType}.`);
                return;
            }

            const payload = {
                equipmentType: values.equipmentType,
                type: values.type || null,
                size: values.size || null,
                quantity: values.quantity,
                yard: selectedYard,
            };

            await axios.post('/api/equipment/', payload);
            message.success('Equipment added successfully.');
            setIsAddModalOpen(false);
            form.resetFields();
            fetchAssets(selectedYard); // 데이터 갱신
        } catch (error) {
            message.error('Failed to add equipment.');
        }
    };

    const renderDynamicFields = () => {
        switch (equipmentType) {
            case 'chassis':
                return (
                    <>
                        <Form.Item
                            name="type"
                            label="Chassis Type"
                            rules={[{ required: true, message: 'Please select a chassis type!' }]}
                        >
                            <Select placeholder="Select chassis type">
                                <Option value="regular">Regular</Option>
                                <Option value="light">Light</Option>
                                <Option value="tandem">Tandem</Option>
                                <Option value="tri-axle">Tri Axle</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please enter the quantity to add!' }]}
                        >
                            <Input type="number" min={1} placeholder="Enter quantity" />
                        </Form.Item>
                    </>
                );
            case 'container':
                return (
                    <>
                        <Form.Item
                            name="type"
                            label="Container Type"
                            rules={[{ required: true, message: 'Please select a container type!' }]}
                        >
                            <Select placeholder="Select container type">
                                <Option value="dry">Dry</Option>
                                <Option value="reefer">Reefer</Option>
                                <Option value="flat-rack">Flat Rack</Option>
                                <Option value="iso-tank">ISO Tank</Option>
                                <Option value="open-top">Open Top</Option>
                                <Option value="try-door">Try Door</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="size"
                            label="Container Size"
                            rules={[{ required: true, message: 'Please select a container size!' }]}
                        >
                            <Select placeholder="Select container size">
                                <Option value="40ST">40ST</Option>
                                <Option value="40HC">40HC</Option>
                                <Option value="20ST">20ST</Option>
                                <Option value="45HC">45HC</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please enter the quantity to add!' }]}
                        >
                            <Input type="number" min={1} placeholder="Enter quantity" />
                        </Form.Item>
                    </>
                );
            case 'trailer':
                return (
                    <>
                        <Form.Item
                            name="size"
                            label="Trailer Size"
                            rules={[{ required: true, message: 'Please select a trailer size!' }]}
                        >
                            <Select placeholder="Select trailer size">
                                <Option value="53">53'</Option>
                                <Option value="48">48'</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please enter the quantity to add!' }]}
                        >
                            <Input type="number" min={1} placeholder="Enter quantity" />
                        </Form.Item>
                    </>
                );
            default:
                return (
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter the quantity to add!' }]}
                    >
                        <Input type="number" min={1} placeholder="Enter quantity" />
                    </Form.Item>
                );
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
        <ManagerLayout>
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
                <Button type="primary" style={{ marginRight: 10, marginLeft: '20px', width: '150px' }} onClick={() => setIsAddModalOpen(true)}>
                    Add Equipment
                </Button>

                {/* 장비 삭제 버튼 */}
                <Button type="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Equipment
                </Button>
            </div>

            {/* 정보 카드 */}
            <div className="cards-container"
                 style={{marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                {sites.length > 0 ? (
                    sites.map((site) => (
                        <Card
                            key={site.site_id}
                            title={`Site ID: ${site.site_id}`}
                            style={{width: 300}}
                            hoverable
                        >
                            <p><strong>Yard ID:</strong> {site.yard_id}</p>
                            <p><strong>Asset Type:</strong> {site.asset_type}</p>
                        </Card>
                    ))
                ) : (
                    <p>No site available</p>
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
                        name="equipmentType"
                        label="Equipment Type"
                        rules={[{required: true, message: 'Please select an equipment type!'}]}
                    >
                        <Select
                            placeholder="Select equipment type"
                            onChange={(value) => setEquipmentType(value)}
                        >
                            <Option value="truck">Truck</Option>
                            <Option value="chassis">Chassis</Option>
                            <Option value="container">Container</Option>
                            <Option value="trailer">Trailer</Option>
                        </Select>
                    </Form.Item>
                    {renderDynamicFields()}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Add
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
        </ManagerLayout>
    );
};

export default ManagerDashboard;