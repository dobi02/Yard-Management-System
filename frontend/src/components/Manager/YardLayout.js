import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Select, Input, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import AssetModal from './Dashboard/AssetModal';
import EquipmentActions from './Dashboard/EquipmentActions';
import './YardLayout.css';
import axios from 'axios';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const YardLayout = () => {
    const { yardId } = useParams(); // URL에서 yardId 읽기
    const navigate = useNavigate(); // 네비게이션 훅
    const [yardDetails, setYardDetails] = useState(null);
    const [viewMode, setViewMode] = useState('map'); // 'map' 또는 'list'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false); // 트랜잭션 모달 상태
    const [form] = Form.useForm();

    // 야드 세부 정보 가져오기
    useEffect(() => {
        const fetchYardDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/places/api/yards/${yardId}/details`);
                setYardDetails(response.data);
            } catch (error) {
                message.error('Failed to load yard details.');
            }
        };
        fetchYardDetails();
    }, [yardId]);

    // 장비 추가 처리
    const handleAddEquipment = async (values) => {
        const { equipmentType, type, quantity, size } = values;

        const apiEndpoints = {
            truck: '/api/trucks/',
            chassis: '/api/chassis/',
            trailer: '/api/trailers/',
            container: '/api/containers/',
        };

        const endpoint = apiEndpoints[equipmentType];
        if (!endpoint) {
            message.error('Invalid equipment type.');
            return;
        }

        try {
            const payload = {
                yard: yardId,
                type,
                quantity,
                ...(equipmentType === 'container' && { size }), // 컨테이너에만 사이즈 포함
            };
            await axios.post(`${API_BASE_URL}${endpoint}`, payload);
            message.success(`${equipmentType.toUpperCase()} added successfully.`);
            setIsAddModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error(`Failed to add ${equipmentType}.`);
        }
    };

    // 장비 삭제 처리
    const handleDeleteEquipment = async (values) => {
        const { equipmentId, equipmentType } = values;

        const apiEndpoints = {
            truck: '/api/trucks/',
            chassis: '/api/chassis/',
            trailer: '/api/trailers/',
            container: '/api/containers/',
        };

        const endpoint = apiEndpoints[equipmentType];
        if (!endpoint) {
            message.error('Invalid equipment type.');
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}${endpoint}${equipmentId}/`);
            message.success(`${equipmentType.toUpperCase()} deleted successfully.`);
            setIsDeleteModalOpen(false);
        } catch (error) {
            message.error(`Failed to delete ${equipmentType}.`);
        }
    };

    // 트랜잭션 추가 처리
    const handleAddTransaction = async (values) => {
        try {
            const payload = {
                yard: yardId,
                driver: values.driver,
                equipment: values.equipment,
                destination: values.destination,
            };
            await axios.post(`${API_BASE_URL}/transactions/api/add`, payload);
            message.success('Transaction added successfully.');
            setIsTransactionModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to add transaction.');
        }
    };

    // 맵 뷰 렌더링
    const renderMapView = () => (
        <div className="yard-map">
            {yardDetails &&
                yardDetails.equipment.map((equip, index) => (
                    <div
                        key={index}
                        className={`equipment-box ${equip.type.toLowerCase()}`}
                        style={{ backgroundColor: equip.color }}
                    >
                        {equip.type} - {equip.id}
                    </div>
                ))}
        </div>
    );

    // 리스트 뷰 렌더링
    const renderListView = () => (
        <Table
            dataSource={yardDetails?.equipment || []}
            columns={[
                { title: 'Type', dataIndex: 'type', key: 'type' },
                { title: 'ID', dataIndex: 'id', key: 'id' },
                { title: 'Status', dataIndex: 'status', key: 'status' },
            ]}
            rowKey="id"
            pagination={false}
        />
    );

    return (
        <ManagerLayout>
            <div className="yard-layout">
                <h2>Yard Layout: {yardId}</h2>
                <div className="view-mode-buttons">
                    <Button
                        type="default"
                        onClick={() => navigate('/manager/dashboard')} // 매니저 대시보드로 이동
                        style={{ width: '150px', marginRight: '10px' }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        type={viewMode === 'map' ? 'primary' : 'default'}
                        onClick={() => setViewMode('map')}
                        style={{ width: '150px' }}
                    >
                        Map View
                    </Button>
                    <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                        style={{ width: '150px', marginLeft: '10px' }}
                    >
                        List View
                    </Button>
                    <EquipmentActions
                        modals={{ add: isAddModalOpen, delete: isDeleteModalOpen }}
                        setModals={({ add, delete: del }) => {
                            setIsAddModalOpen(add);
                            setIsDeleteModalOpen(del);
                        }}
                        isDisabled={!yardDetails}
                    />
                    <Button
                        type="default"
                        onClick={() => setIsTransactionModalOpen(true)}
                        style={{ width: '150px', marginLeft: '10px' }}
                    >
                        Add Order
                    </Button>
                </div>
                {viewMode === 'map' ? renderMapView() : renderListView()}

                {/* 장비 추가 모달 */}
                <AssetModal
                    type="add"
                    visible={isAddModalOpen}
                    onCancel={() => setIsAddModalOpen(false)}
                    onFinish={handleAddEquipment}
                />

                {/* 장비 삭제 모달 */}
                <AssetModal
                    type="delete"
                    visible={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onFinish={handleDeleteEquipment}
                />

                {/* 트랜잭션 추가 모달 */}
                <Modal
                    title="Add Transaction"
                    visible={isTransactionModalOpen}
                    onCancel={() => setIsTransactionModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddTransaction}>
                        <Form.Item
                            name="driver"
                            label="Driver"
                            rules={[{ required: true, message: 'Please select a driver!' }]}
                        >
                            <Select placeholder="Select a driver">
                                {/* 예시 데이터 */}
                                <Option value="driver1">Driver 1</Option>
                                <Option value="driver2">Driver 2</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="equipment"
                            label="Equipment"
                            rules={[{ required: true, message: 'Please select equipment!' }]}
                        >
                            <Select placeholder="Select equipment">
                                {yardDetails?.equipment.map((equip) => (
                                    <Option key={equip.id} value={equip.id}>
                                        {equip.type} - {equip.id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="destination"
                            label="Destination Yard"
                            rules={[{ required: true, message: 'Please enter destination!' }]}
                        >
                            <Input placeholder="Enter destination yard" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Submit Order
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default YardLayout;
