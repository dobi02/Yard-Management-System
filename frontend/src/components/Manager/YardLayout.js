import React, { useState, useEffect } from 'react';
import {Button, Table, Modal, Form, Select, Input, message, Spin} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import AssetModal from './YardLayout/AssetModal';
import EquipmentActions from './Dashboard/EquipmentActions';
import './YardLayout.css';
import axios from 'axios';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const YardLayout = () => {
    const { yardId } = useParams(); // URL에서 yardId 읽기
    const navigate = useNavigate(); // 네비게이션 훅
    const [sites, setSites] = useState(null);
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
    const [parkingSlots, setParkingSlots] = useState([]);
    const [selectedChassis, setSelectedChassis] = useState(null);
    const [selectedTrailer, setSelectedTrailer] = useState(false);
    const [form] = Form.useForm();
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [isLoading, setIsLoading] = useState(true);




    // 야드 세부 정보 가져오기
    useEffect(() => {

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

        const fetchInfo = async () => {
            try {
            const response = await axios.get(`${API_BASE_URL}/places/api/yards/${yardId}/count/`);


                setSites(response.data.site_list);
                setChassis(response.data.chassis_list);
                setTrucks(response.data.trucks_list);
                setContainers(response.data.containers_list);
                setTrailers(response.data.trailers_list);
                setParkingSlots(response.data.parking_slots);

                } catch(error)  {
                    console.error("Error fetching data:", error);
                }
        };

        const fetchData = async () => {
            setIsLoading(true); // 로딩 시작
            await Promise.all([fetchInfo(), fetchDriversAndYards()]);
            setIsLoading(false); // 로딩 종료
        };

        fetchData();
    }, [yardId]);



    // **[추가] resetForm 함수**: 폼의 필드를 초기화합니다.
    const resetForm = () => {
        form.resetFields();
        setSelectedDriver(null); // 드라이버 상태 초기화
        setSelectedTruck(null); // 트럭 상태 초기화
    };


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
                size,
            };
            console.log(payload);
            await axios.post(`${API_BASE_URL}${endpoint}`, payload);
            message.success(`${equipmentType.toUpperCase()} added successfully.`);
            setIsAddModalOpen(false);
            form.resetFields();

            await fetchEquipment();
        } catch (error) {
            message.error(`Failed to add ${equipmentType}.`);
        }
    };

    const handleDeleteEquipment = async (equipmentId, equipmentType) => {
        if (!equipmentId || !equipmentType) {
            message.error('Invalid equipment ID or type.');
            return;
        }

        // API Endpoint 매핑
        const apiEndpoints = {
            trucks: '/assets/api/trucks/',
            chassis: '/assets/api/chassis/',
            containers: '/assets/api/containers/',
            trailers: '/assets/api/trailers/',
        };

        const endpoint = apiEndpoints[equipmentType];
        if (!endpoint) {
            message.error('Invalid equipment type.');
            return;
        }

        try {
            // 장비 삭제 요청
            await axios.delete(`${API_BASE_URL}${endpoint}${equipmentId}/`);
            message.success('Equipment deleted successfully.');

            // 최신 장비 데이터를 다시 가져옴
            await fetchEquipment();
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
                driver_id: values.driver_id,
                // truck: values.truck,
                // chassis: selectedChassis,
                // container: values.container || null,
                // trailer: selectedTrailer ? values.trailer : null,
                destination_yard_id: values.destination_yard_id,
                origin_yard_id: yardId,
                truck_id: values.truck_id,
                chassis_id: values.chassis_id,
                container_id: values.container_id,
                trailer_id: values.trailer_id,
            };
            await axios.post(`${API_BASE_URL}/api/transactions/`, payload);
            message.success('Order added successfully.');
            resetForm();
            setIsOrderModalOpen(false);
            form.resetFields();
            setSelectedChassis(null);
            setSelectedTrailer(false);
        } catch (error) {
            message.error('Failed to add order.');
        }
    };

    const renderMapView = () => (
    <div className="yard-map" style={{ position: "relative", width: "100%", height: "1000px", backgroundColor: "#f5f5f5" }}>
        {sites.map((site, idx) => {
            const typeSlots = parkingSlots[idx] || []; // 각 타입별 슬롯 데이터
            const slotCount = site.total_slots;

            // Y축 위치 계산 (모든 사이트 간 일정한 세로 간격)
            const topPosition = idx === 0
                ? 100 // 첫 번째 사이트
                : idx === 1 || idx === 2
                ? 300 // 두 번째, 세 번째 사이트
                : 500; // 네 번째 사이트

            // X축 위치 계산 (두 번째와 세 번째 사이트를 가로로 배치)
            const leftPosition = idx === 2
                ? 400 // 세 번째 사이트는 오른쪽으로 이동
                : 150; // 나머지는 기본 X축 위치

            // 열 계산 (2줄 고정)
            const rows = 2;
            const columns = Math.ceil(slotCount / rows);

            return (
                <div
                    key={site.asset_type}
                    style={{
                        position: "absolute",
                        top: `${topPosition}px`, // 조정된 Y축 위치
                        left: `${leftPosition}px`, // 조정된 X축 위치
                        padding: "0px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${columns}, 30px)`, // 슬롯 폭 조정
                            gridAutoRows: "50px", // 고정된 슬롯 높이
                            gap: "0px", // 슬롯 간 간격 제거
                        }}
                    >
                        {typeSlots.map((slot, slotIdx) => (
                            <div
                                key={slot.slot_id}
                                style={{
                                    width: "30px",
                                    height: "50px",
                                    border: "1px solid #ccc", // 슬롯 경계
                                    boxSizing: "border-box",
                                    backgroundColor: slot.is_occupied ? "#ffcccc" : "#ffffff", // 점유 상태에 따라 색상 변경
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);

    const renderListView = () => (
        <div className="list-view">
            <div className="asset-column">
                <h3>Trucks</h3>
                {trucks.map((truck, index) => (
                    <div key={`truck-${index}`} className="asset-card">
                        <Button
                            type="danger"
                            className="delete-btn"
                            onClick={() => handleDeleteEquipment(truck.truck_id, 'trucks')}
                        >
                            Delete
                        </Button>
                        <p><strong>ID:</strong> {truck.truck_id}</p>
                        <p><strong>Type:</strong> {truck.type}</p>
                        <p><strong>Status:</strong> {truck.state}</p>
                    </div>
                ))}
            </div>

            <div className="asset-column">
                <h3>Chassis</h3>
                {chassis.map((ch, index) => (
                    <div key={`chassis-${index}`} className="asset-card">
                        <Button
                            type="danger"
                            className="delete-btn"
                            onClick={() => handleDeleteEquipment(ch.chassis_id, 'chassis')}
                        >
                            Delete
                        </Button>
                        <p><strong>ID:</strong> {ch.chassis_id}</p>
                        <p><strong>Type:</strong> {ch.type}</p>
                        <p><strong>Status:</strong> {ch.state}</p>
                    </div>
                ))}
            </div>

            <div className="asset-column">
                <h3>Containers</h3>
                {containers.map((container, index) => (
                    <div key={`container-${index}`} className="asset-card">
                        <Button
                            type="danger"
                            className="delete-btn"
                            onClick={() => handleDeleteEquipment(container.container_id, 'containers')}
                        >
                            Delete
                        </Button>
                        <p><strong>ID:</strong> {container.container_id}</p>
                        <p><strong>Type:</strong> {container.type}</p>
                        <p><strong>Size:</strong> {container.size}</p>
                        <p><strong>Status:</strong> {container.state}</p>
                    </div>
                ))}
            </div>

            <div className="asset-column">
                <h3>Trailers</h3>
                {trailers.map((trailer, index) => (
                    <div key={`trailer-${index}`} className="asset-card">
                        <Button
                            type="danger"
                            className="delete-btn"
                            onClick={() => handleDeleteEquipment(trailer.trailer_id, 'trailers')}
                        >
                            Delete
                        </Button>
                        <p><strong>ID:</strong> {trailer.trailer_id}</p>
                        <p><strong>Size:</strong> {trailer.size}</p>
                        <p><strong>Status:</strong> {trailer.state}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const fetchYardDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/places/api/sites/${yardId}/`);
            setSites(response.data);
        } catch (error) {
            message.error('Failed to load yard details.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEquipment = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/places/api/yards/${yardId}/count/`);


                setSites(response.data.site_list);
                setChassis(response.data.chassis_list);
                setTrucks(response.data.trucks_list);
                setContainers(response.data.containers_list);
                setTrailers(response.data.trailers_list);
                setParkingSlots(response.data.parking_slots);


        } catch (error) {
            message.error('Failed to fetch equipment.');
        }
    };

    return (
        <ManagerLayout>
            {isLoading ? (
                <div className="loading-container">Loading details...</div>
            ) : (
                <div className="yard-layout">
                <h2>Yard Layout: {yardId}</h2>
                <div className="view-mode-buttons">
                    <Button
                        type="default"
                        onClick={() => navigate('/manager/dashboard')}
                        style={{width: '150px', marginRight: '10px'}}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        type={viewMode === 'map' ? 'primary' : 'default'}
                        onClick={() => setViewMode('map')}
                        style={{width: '150px'}}
                    >
                        Map View
                    </Button>
                    <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                        style={{width: '150px', marginLeft: '10px'}}
                    >
                        List View
                    </Button>
                    <EquipmentActions
                        modals={{
                            add: isAddModalOpen,
                            delete: isDeleteModalOpen,
                        }}
                        setModals={({add, delete: del}) => {
                            setIsAddModalOpen(add);
                            setIsDeleteModalOpen(del);
                        }}
                        isDisabled={!sites}
                    />
                    <Button
                        type="default"
                        onClick={() => setIsOrderModalOpen(true)}
                        style={{width: '150px', marginLeft: '10px'}}
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
                <Modal
                    title="Add Order"
                    visible={isOrderModalOpen}
                    onCancel={() => {
                        resetForm(); // **[변경] onCancel 시에도 폼 초기화**
                        setIsOrderModalOpen(false);
                    }}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddOrder}>
                        <Form.Item
                            name="driver_id"
                            label="Driver"
                            rules={[{required: true, message: 'Please select a driver!'}]}
                        >
                            <Select placeholder="Select a driver">
                                {drivers.map((driver) => (
                                    <Option
                                        key={driver.user.username}
                                        value={`${driver.user.username}`}
                                    >
                                        {driver.user.first_name} {driver.user.last_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="truck_id"
                            label="Truck"
                            // rules={[{ required: true, message: 'Please select a truck!' }]}
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
                            name="chassis_id"
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
                            name="container_id"
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
                            name="trailer_id"
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
                            name="destination_yard_id"
                            label="Destination Yard"
                            rules={[{required: true, message: 'Please select a yard!'}]}
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
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                {/* **[추가] Reset 버튼** */}
                                <Button onClick={resetForm} style={{width: '48%'}}>
                                    Reset
                                </Button>
                                <Button type="primary" htmlType="submit" style={{width: '48%'}}>
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
                )}
        </ManagerLayout>
    );
};

export default YardLayout;
