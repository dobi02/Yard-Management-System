import React, { useState, useEffect } from 'react';
import {Button, Modal, Form, Select, message,} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import AssetModal from './YardLayout/AssetModal';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EquipmentActions from './Dashboard/EquipmentActions';
import './YardLayout.css';
import './ParkingLot.css';
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
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [form] = Form.useForm();
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [equipmentCounts, setEquipmentCounts] = useState({
        trucks: 0,
        chassis: 0,
        containers: 0,
        trailers: 0,
    });



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

                setEquipmentCounts({
                    trucks: response.data.trucks_list.length,
                    chassis: response.data.chassis_list.length,
                    containers: response.data.containers_list.length,
                    trailers: response.data.trailers_list.length,
                });

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
        setSelectedChassis(null);
        setSelectedTrailer(null);
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
                manager_id: localStorage.getItem('username')
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
    const [selectedSlot, setSelectedSlot] = useState(null);

    const normalizeAssets = (assets, idkey, assetType) => {
        return assets.map((asset) => ({
            ...asset,
            id:asset[idkey],
            assetType, // 장비 유형
        }));
    };

    // 장비 합치기
    const normalizedTrucks = normalizeAssets(trucks, "truck_id", "trucks");
    const normalizedChassis = normalizeAssets(chassis, "chassis_id", "chassis");
    const normalizedContainers = normalizeAssets(containers, "container_id","containers");
    const normalizedTrailers = normalizeAssets(trailers, "trailer_id","trailers");

    const allAssets = [
        ...normalizedTrucks,
        ...normalizedChassis,
        ...normalizedContainers,
        ...normalizedTrailers,
    ];

    const assetsLookup = {};
    allAssets.forEach((asset) => {
        if (asset.parked_place) {
            assetsLookup[asset.parked_place] = asset;
        }
    });



    const updateAssetLocation = async (asset, newSlotId, oldSlotId) => {
            try {
                let endpoint = "";
                let payload = {};

                // 새로운 슬롯 정보 가져오기
                const newSlot = parkingSlots.flat().find(slot => slot.slot_id === newSlotId);
                if (!newSlot) {
                    throw new Error("Invalid newSlotId: Slot not found");
                }

                switch (asset.assetType) {
                    case "trucks" :
                        endpoint = `${API_BASE_URL}/assets/api/moving/trucks/`;
                        payload = {
                            truck: asset.id,
                            destination_slot: newSlotId, // 목적지 슬롯 ID
                            slot_id: oldSlotId,
                            site_id: newSlot.site_id, // 슬롯의 site_id 가져오기
                        };
                        break;
                    case "trailers" :
                        endpoint = `${API_BASE_URL}/assets/api/moving/trailers/`;
                        payload = {
                            trailer: asset.id,
                            destination_slot: newSlotId,
                            slot_id: oldSlotId,
                            site_id: newSlot.site_id, // 슬롯의 site_id 가져오기
                        };
                        break;
                    case "chassis":
                        endpoint = `${API_BASE_URL}/assets/api/moving/chassis/`;
                        payload = {
                            chassis: asset.id,
                            destination_slot: newSlotId,
                            slot_id: oldSlotId,
                            site_id: newSlot.site_id, // 슬롯의 site_id 가져오기
                        };
                        break;
                    case "containers":
                        endpoint = `${API_BASE_URL}/assets/api/moving/containers/`;
                        payload = {
                            container: asset.id, // 컨테이너 ID
                            destination_slot: newSlotId,
                            slot_id: oldSlotId,
                            site_id: newSlot.site_id, // 슬롯의 site_id 가져오기
                        };
                        break;
                    default:
                        throw new Error("Unknown asset type");
                }
                // 장비 업데이트
                const assetResponse = await axios.patch(endpoint, payload);
                console.log("Asset update:", assetResponse.data);


                await fetchEquipment();

            } catch (error) {
                console.error("Error updating asset or slot:", error.response?.data || error.message);
                console.error("Error updating asset or slot:", error);
                message.error("Failed to update asset or slot. Please try again.");
            }
        };





    // 슬롯
    const Slot = ({ slot, onClick, assetsLookup, updateAssetLocation }) => {
  // 슬롯에 연결된 에셋 확인
  const asset = assetsLookup[slot.slot_id];

  const [{ isOver }, dropRef] = useDrop({
    accept: "ASSET",
    drop: async (draggedAsset) => {
      const newSlotId = slot.slot_id;
      const oldSlotId = draggedAsset.parked_place;

      // 드래그된 에셋의 위치 업데이트
      await updateAssetLocation(draggedAsset, newSlotId, oldSlotId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: "ASSET",
    item: { ...asset, parked_place: slot.slot_id },
    canDrag: !!asset, // 에셋이 있을 때만 드래그 가능
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // 슬롯 색상 결정 로직
  const getSlotColor = () => {
    if (!slot.is_occupied) {
      if (slot.site_id.includes("truck")) return "#6bb36d";
      if (slot.site_id.includes("trailer")) return "#ffbb4e";
      if (slot.site_id.includes("container")) return "#519cea";
      if (slot.site_id.includes("chassis")) return "#80c1cc";
      return "#ffffff";
    } else {
      return "#ff8080";
    }
  };

  return (
    <div
      ref={dropRef}
      style={{
        width: "40px",
        height: "60px",
        backgroundColor: getSlotColor(),
        border: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => onClick(slot)}
    >
      {/* 에셋이 있으면 렌더링 */}
      {asset && (
        <div
          ref={dragRef}
          style={{
            width: "40px",
            height: "60px",
            border: "1px solid #000",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "move",
          }}
        >
          {asset.id}
        </div>
      )}
    </div>
  );
};


    const renderMapView = () => {





        const handleSlotClick = (slot) => {
            setSelectedSlot(slot);
        };



        return (

        <div
            style={{
                display: "flex", // 슬롯과 정보란을 옆으로 배치
                gap: "20px", // 슬롯 영역과 정보 영역 간 간격
                padding: "20px",
            }}
        >
            {/* 슬롯 영역 */}
            <div
                style={{
                    marginTop: "30px",
                    position: "relative",
                    width: "1000px", // 슬롯 그룹의 너비
                    backgroundColor: "#ddd",
                    borderRadius: "10px",
                    padding: "50px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px", // 사이트 그룹 간 간격
                }}
            >
                {/* 첫 번째 사이트 */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px", // 슬롯 간 간격
                    }}
                >
                    {parkingSlots[0]?.map((slot) => (
                        <Slot
                            key={slot.slot_id}
                            slot={slot}
                            onClick={handleSlotClick}
                            assetsLookup={assetsLookup} // 에셋 정보를 전달
                            updateAssetLocation={updateAssetLocation} // 에셋 위치 업데이트 함수 전달
                        />

                    ))}
                </div>

                {/* 두 번째와 세 번째 사이트 */}
                <div
                    style={{
                        display: "flex",
                        gap: "50px", // 두 사이트 간 간격
                    }}
                >
                    {/* 두 번째 사이트 */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px",
                        }}
                    >
                        {parkingSlots[1]?.map((slot) => (
                            <Slot
                            key={slot.slot_id}
                            slot={slot}
                            onClick={handleSlotClick}
                            assetsLookup={assetsLookup} // 에셋 정보를 전달
                            updateAssetLocation={updateAssetLocation} // 에셋 위치 업데이트 함수 전달
                            />
                        ))}
                    </div>

                    {/* 세 번째 사이트 */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px",
                        }}
                    >
                        {parkingSlots[2]?.map((slot) => (
                            <Slot
                            key={slot.slot_id}
                            slot={slot}
                            onClick={handleSlotClick}
                            assetsLookup={assetsLookup} // 에셋 정보를 전달
                            updateAssetLocation={updateAssetLocation} // 에셋 위치 업데이트 함수 전달
                            />
                        ))}
                    </div>
                </div>

                {/* 네 번째 사이트 */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                    }}
                >
                    {parkingSlots[3]?.map((slot) => (
                        <Slot
                            key={slot.slot_id}
                            slot={slot}
                            onClick={handleSlotClick}
                            assetsLookup={assetsLookup} // 에셋 정보를 전달
                            updateAssetLocation={updateAssetLocation} // 에셋 위치 업데이트 함수 전달
                            />
                    ))}
                </div>
            </div>

            {/* 선택된 슬롯 정보란 */}
            <div
                style={{
                    width: "300px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {selectedSlot ? (
                    <>
                        <h3>Slot Details</h3>
                        <p><strong>Slot ID:</strong> {selectedSlot.slot_id}</p>
                        <p><strong>Equipment Type:</strong> {selectedSlot.site_id}</p>
                        <p><strong>Occupancy Status:</strong> {selectedSlot.is_occupied ? "Occupied" : "Empty"}</p>

                        {assetsLookup[selectedSlot.slot_id] ? (
                            <>
                                <h3>Asset Details</h3>
                                <p>
                                    <strong>{assetsLookup[selectedSlot.slot_id].assetType}</strong>{" "}
                                </p>
                                <p>
                                    <strong>ID:</strong>{" "}
                                    {assetsLookup[selectedSlot.slot_id].id || "N/A"}
                                </p>
                                {assetsLookup[selectedSlot.slot_id].type && (
                                    <p>
                                        <strong>Asset Type:</strong> {assetsLookup[selectedSlot.slot_id].type}
                                    </p>
                                )}
                                {assetsLookup[selectedSlot.slot_id].size && (
                                    <p>
                                        <strong>Asset size:</strong>{" "}
                                        {assetsLookup[selectedSlot.slot_id].size || "N/A"}
                                    </p>
                                )}

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {assetsLookup[selectedSlot.slot_id].state || "N/A"}
                                </p>

                            </>
                        ) : (
                            <p>No asset parked here.</p>
                        )}
                    </>
                ) : (
                    <p>Click a slot to view details.</p>
                )}
            </div>
        </div>
        );
    };


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

    const equipmentData = [
        { label: 'Trucks', count: equipmentCounts.trucks, color: '#4CAF50' },
        { label: 'Chassis', count: equipmentCounts.chassis, color: '#00BCD4' },
        { label: 'Containers', count: equipmentCounts.containers, color: '#2196F3' },
        { label: 'Trailers', count: equipmentCounts.trailers, color: '#FF9800' },
    ];

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

                setEquipmentCounts({
                    trucks: response.data.trucks_list.length,
                    chassis: response.data.chassis_list.length,
                    containers: response.data.containers_list.length,
                    trailers: response.data.trailers_list.length,
                });


                } catch (error) {
                    message.error('Failed to fetch equipment.');
                }
                };

    return (
        <ManagerLayout>
            {isLoading ? (
                <div className="loading-container">Loading details...</div>
            ) : (
                <DndProvider backend={HTML5Backend}>
                <div className="yard-layout">
                <h2 className="yard-title">{yardId}</h2>
                <div className="equipment-summary">
                    {equipmentData.map((item, index) => (
                        <div
                            key={index}
                            className="equipment-card"
                            style={{ backgroundColor: item.color }}
                        >
                            <div className="equipment-count">{item.count}</div>
                            <div className="equipment-label">{item.label}</div>
                        </div>
                    ))}
                </div>
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
                            <Select placeholder="Select a truck"
                                onChange={(value) => {
                                    setSelectedTruck(value); // 트럭 상태 업데이트
                                    setSelectedChassis(null); // 샤시 초기화
                                }}
                            >
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
                                disabled={!selectedTruck || selectedTrailer}
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
                                disabled={!selectedTruck || selectedChassis}
                                onChange={(value) => setSelectedTrailer(value)}
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
                                        {yard.yard_id}
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
                    </DndProvider>
                )}
        </ManagerLayout>
    );
};

export default YardLayout;
