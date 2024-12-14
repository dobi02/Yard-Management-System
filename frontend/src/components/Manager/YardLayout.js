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
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false); // 주문 추가 모달 상태
    const [drivers, setDrivers] = useState([]); // 드라이버 목록
    const [yards, setYards] = useState([]); // 목적지 야드 목록
    const [trucks, setTrucks] = useState([]); // 트럭 목록
    const [chassis, setChassis] = useState([]); // 샤시 목록
    const [containers, setContainers] = useState([]); // 컨테이너 목록
    const [trailers, setTrailers] = useState([]); // 트레일러 목록
    const [selectedChassis, setSelectedChassis] = useState(null);
    const [selectedTrailer, setSelectedTrailer] = useState(false);
    const [form] = Form.useForm();

    // 야드 세부 정보 가져오기
    useEffect(() => {
        const fetchYardDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/places/api/sites/${yardId}/`);
                setYardDetails(response.data);
            } catch (error) {
                message.error('Failed to load yard details.');
            }
        };

        const fetchDriversAndYards = async () => {
            try {
                const driversResponse = await axios.get(`${API_BASE_URL}/drivers/api/yard-drivers/${yardId}/`);
                setDrivers(driversResponse.data);

                const yardsResponse = await axios.get(`${API_BASE_URL}/places/api/yards/`);
                setYards(yardsResponse.data);
            } catch (error) {
                message.error('Failed to fetch drivers or yards.');
            }
        };

        const fetchEquipment = async () => {
            try {
                const truckResponse = await axios.get(`${API_BASE_URL}/assets/api/trucks/yards/${yardId}/`);
                const chassisResponse = await axios.get(`${API_BASE_URL}/assets/api/chassis/yards/${yardId}/`);
                const containerResponse = await axios.get(`${API_BASE_URL}/assets/api/containers/yards/${yardId}/`);
                const trailerResponse = await axios.get(`${API_BASE_URL}/assets/api/trailers/yards/${yardId}/`);

                setTrucks(truckResponse.data);
                setChassis(chassisResponse.data);
                setContainers(containerResponse.data);
                setTrailers(trailerResponse.data);
            } catch (error) {
                message.error('Failed to fetch equipment.');
            }
        };

        fetchYardDetails();
        fetchDriversAndYards();
        fetchEquipment();
    }, [yardId]);

    // 장비 추가 처리
    const handleAddEquipment = async (values) => {
        const { equipmentType, type, quantity, size } = values;

        const apiEndpoints = {
            truck: '/assets/api/trucks/',
            chassis: '/assets/api/chassis/',
            trailer: '/assets/api/trailers/',
            container: '/assets/api/containers/',
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
        const { equipmentId } = values;

        const equipmentType = Object.keys(yardDetails).find((key) =>
            yardDetails[key].some((item) => item.id === equipmentId)
        );

        if (!equipmentType) {
            message.error('Invalid equipment selection.');
            return;
        }

        const apiEndpoints = {
            truck: '/assets/api/trucks/',
            chassis: '/assets/api/chassis/',
            trailer: '/assets/api/trailers/',
            container: '/assets/api/containers/',
        };

        try {
            await axios.delete(`${API_BASE_URL}${apiEndpoints[equipmentType]}${equipmentId}/`);
            message.success('Equipment deleted successfully.');
            setIsDeleteModalOpen(false);
        } catch (error) {
            message.error('Failed to delete equipment.');
        }
    };

    // 주문 추가 처리
    const handleAddOrder = async (values) => {
        if (!selectedChassis && values.container) {
            message.error('Container cannot be selected without a chassis');
            return;
        }

        try {
            const payload = {
                driver: values.driver,
                truck: values.truck,
                chassis: selectedChassis,
                container: values.container || null,
                trailer: selectedTrailer ? values.trailer : null,
                to_yard: values.to_yard,
            };
            await axios.post(`${API_BASE_URL}/api/transactions/`, payload);
            message.success('Order added successfully.');
            setIsOrderModalOpen(false);
            form.resetFields();
            setSelectedChassis(null);
            setSelectedTrailer(false);
        } catch (error) {
            message.error('Failed to add order.');
        }
    };

    const renderMapView = () => (
        <div className="yard-map">
            {yardDetails?.sites?.map((site, index) => (
                <div key={index} className="map-site">
                    <h3 className="site-title">{site.site_name}</h3>
                    <div className="site-slots">
                        {site.slots.map((slot, slotIndex) => (
                            <div
                                key={slotIndex}
                                className={`map-tile ${slot.isOccupied ? 'occupied' : 'empty'}`}
                            >
                                {slot.isOccupied ? slot.equipmentType : 'Empty'}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // 리스트 뷰 렌더링
    const renderListView = () => (
        <Table
            dataSource={yardDetails.equipment || []}
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
                        modals={{
                            add: isAddModalOpen,
                            delete: isDeleteModalOpen,
                        }}
                        setModals={({ add, delete: del }) => {
                            setIsAddModalOpen(add);
                            setIsDeleteModalOpen(del);
                        }}
                        isDisabled={!yardDetails}
                    />
                    <Button
                        type="default"
                        onClick={() => setIsOrderModalOpen(true)}
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
                    yardAssets={yardDetails || {}} // 현재 야드 데이터 전달
                    equipmentType="equipment" // 필터링할 장비 유형 전달
                />
                <Modal
                    title="Add Order"
                    visible={isOrderModalOpen}
                    onCancel={() => setIsOrderModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddOrder}>
                        <Form.Item
                            name="driver"
                            label="Driver"
                            rules={[{ required: true, message: 'Please select a driver!' }]}
                        >
                            <Select placeholder="Select a driver">
                                {drivers.map((driver) => (
                                    <Option
                                        key={driver.user.username}
                                        value={`${driver.user.first_name} ${driver.user.last_name}`}
                                    >
                                        {driver.user.first_name} {driver.user.last_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="truck"
                            label="Truck"
                            rules={[{ required: true, message: 'Please select a truck!' }]}
                        >
                            <Select placeholder="Select a truck">
                                {trucks.map((truck) => (
                                    <Option key={truck.truck_id} value={truck.truck_id}>
                                        {truck.truck_id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="chassis"
                            label="Chassis"
                        >
                            <Select
                                placeholder="Select a chassis"
                                allowClear
                                onChange={(value) => setSelectedChassis(value)}
                            >
                                {chassis.map((item) => (
                                    <Option key={item.chassis_id} value={item.chassis_id}>
                                        {item.chassis_id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="container"
                            label="Container"
                        >
                            <Select
                                placeholder="Select a container"
                                allowClear
                                disabled={!selectedChassis}
                            >
                                {containers.map((item) => (
                                    <Option key={item.container_id} value={item.container_id}>
                                        {item.container_id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="trailer"
                            label="Trailer"
                        >
                            <Select
                                placeholder="Select a trailer"
                                allowClear
                                disabled={selectedChassis || selectedTrailer}
                            >
                                {trailers.map((item) => (
                                    <Option key={item.trailer_id} value={item.trailer_id}>
                                        {item.trailer_id}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="to_yard"
                            label="Destination Yard"
                            rules={[{ required: true, message: 'Please select a yard!' }]}
                        >
                            <Select placeholder="Select a yard">
                                {yards.map((yard) => (
                                    <Option key={yard.yard_id} value={yard.yard_id}>
                                        {yard.yard_id} ({yard.division_id})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default YardLayout;
