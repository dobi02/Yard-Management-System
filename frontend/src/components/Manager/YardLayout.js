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
    const { yardId } = useParams();
    const navigate = useNavigate();
    const [yardDetails, setYardDetails] = useState(null);
    const [viewMode, setViewMode] = useState('map');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedChassis, setSelectedChassis] = useState(null);
    const [selectedTrailer, setSelectedTrailer] = useState(false);
    const [yards, setYards] = useState([]);

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

        const fetchYards = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/places/api/yards/`);
                setYards(response.data);
            } catch (error) {
                message.error('Failed to fetch yards.');
            }
        };
        fetchYards();
    }, [yardId]);

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
                ...(equipmentType === 'container' && { size }),
            };
            await axios.post(`${API_BASE_URL}${endpoint}`, payload);
            message.success(`${equipmentType.toUpperCase()} added successfully.`);
            setIsAddModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error(`Failed to add ${equipmentType}.`);
        }
    };

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
                        onClick={() => navigate('/manager/dashboard')}
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

                <AssetModal
                    type="add"
                    visible={isAddModalOpen}
                    onCancel={() => setIsAddModalOpen(false)}
                    onFinish={handleAddEquipment}
                />

                <AssetModal
                    type="delete"
                    visible={isDeleteModalOpen}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onFinish={handleDeleteEquipment}
                />

                <Modal
                    title="Add Order"
                    visible={isTransactionModalOpen}
                    onCancel={() => setIsTransactionModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddTransaction}>
                        {/* 드라이버, 장비, 목적지 선택 폼 */}
                    </Form>
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default YardLayout;
