import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Select, Checkbox, message } from 'antd';
import MainLayout from "./ManagerLayout";
import axios from 'axios';
import './TransactionPage.css';

const { Option } = Select;

const TransactionsPage = () => {
  const startYards = "HOU_01";
  const [drivers, setDrivers] = useState([]);
  const [yards, setYards] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [chassis, setChassis] = useState([]);
  const [containers, setContainers] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [outgoingOrders, setOutgoingOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedChassis, setSelectedChassis] = useState(null); // 선택된 샤시 상태
  const [selectedTrailer, setSelectedTrailer] = useState(false); // 트레일러 선택 여부

  useEffect(() => {
    fetchDrivers();
    fetchYards();
    fetchEquipment();
  }, []);

  // API 호출
  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/drivers/api/yard-drivers/${startYards}/`);
      setDrivers(response.data);
    } catch (error) {
      message.error('Failed to fetch drivers');
    }
  };

  const fetchYards = async () => {
    try {
      const response = await axios.get('http://localhost:8000/places/api/yards/');
      setYards(response.data);
    } catch (error) {
      message.error('Failed to fetch yards');
    }
  };

  const fetchEquipment = async () => {
    try {
      const truckResponse = await axios.get(`http://localhost:8000/assets/api/trucks/yards/${startYards}/`);
      const chassisResponse = await axios.get(`http://localhost:8000/assets/api/chassis/yards/${startYards}/`);
      const containerResponse = await axios.get(`http://localhost:8000/assets/api/containers/yards/${startYards}/`);
      const trailerResponse = await axios.get(`http://localhost:8000/assets/api/trailers/yards/${startYards}/`);
      setTrucks(truckResponse.data);
      setChassis(chassisResponse.data);
      setContainers(containerResponse.data);
      setTrailers(trailerResponse.data);
    } catch (error) {
      message.error('Failed to fetch equipment');
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
        chassis: selectedChassis, // 샤시 선택
        container: values.container || null, // 컨테이너 선택
        trailer: selectedTrailer ? values.trailer : null, // 트레일러 선택
        to_yard: values.to_yard,
      };
      const response = await axios.post('/api/transactions/', payload);
      message.success('Order added successfully.');
      setOutgoingOrders([response.data, ...outgoingOrders]); // 최신 주문을 리스트에 추가
      setIsOrderModalOpen(false);
      form.resetFields();
      setSelectedChassis(null);
      setSelectedTrailer(false);
    } catch (error) {
      message.error('Failed to add order.');
    }
  };

  const handleEquipmentChange = (checkedValues) => {
    // 트레일러가 선택되면 샤시/컨테이너 비활성화
    setSelectedTrailer(checkedValues.includes('Trailer'));
    if (!checkedValues.includes('Chassis')) {
      setSelectedChassis(null); // 샤시가 선택 해제되면 초기화
    }
  };

  return (
    <MainLayout>
      <div className="transactions-header">
        <h2>In/Out Transactions</h2>
        <Button
          type="primary"
          onClick={() => setIsOrderModalOpen(true)}
          style={{ marginBottom: '10px' }}
        >
          Add Order
        </Button>
      </div>

      {/* In/Out 카드 리스트 */}
      <div className="transactions-list">
        {outgoingOrders.map((order, index) => (
          <Card key={`order-${index}`} title="Outgoing Order" className="transaction-card">
            <p><b>Driver:</b> {order.driver}</p>
            <p><b>Truck:</b> {order.truck}</p>
            {order.chassis && <p><b>Chassis:</b> {order.chassis}</p>}
            {order.container && <p><b>Container:</b> {order.container}</p>}
            {order.trailer && <p><b>Trailer:</b> {order.trailer}</p>}
            <p><b>Destination Yard:</b> {order.to_yard}</p>
          </Card>
        ))}
      </div>

      {/* 주문 추가 모달 */}
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
                    label={`${driver.user.first_name} ${driver.user.last_name}`}
                >
                  {driver.user.first_name} {" "} {driver.user.last_name}
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
              onChange={(value) => setSelectedChassis(value)} // 선택된 샤시 상태 업데이트
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
              disabled={!selectedChassis} // 샤시가 선택되지 않으면 비활성화
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
              disabled={selectedChassis || selectedTrailer} // 샤시 또는 트레일러가 선택되면 비활성화
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
    </MainLayout>
  );
};

export default TransactionsPage;
