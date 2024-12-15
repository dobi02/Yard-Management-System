import React, { useState, useEffect } from 'react';
import { Table, Input, Button, message, Modal, Form, Select, Tag } from 'antd';
import ManagerLayout from './ManagerLayout';
import axios from 'axios';
import './DriverManagement.css';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // 드라이버 추가 모달
    const [form] = Form.useForm();

    const DIVISIONS = ['LA', 'PHX', 'HOU', 'SAV', 'MOB']; // 고정된 Division 리스트

    // 드라이버 데이터 가져오기
    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/drivers/api/drivers/`);
            setDrivers(response.data);
            setFilteredDrivers(response.data); // 초기에는 필터된 데이터가 전체 데이터와 동일
            setLoading(false);
        } catch (error) {
            message.error('Failed to load drivers.');
            setLoading(false);
        }
    };

    // 드라이버 삭제
    const handleDeleteDriver = async (driverId) => {
        try {
            await axios.delete(`${API_BASE_URL}/drivers/api/drivers/${driverId}/`);
            message.success('Driver deleted successfully.');
            fetchDrivers(); // 데이터 갱신
        } catch (error) {
            message.error('Failed to delete driver.');
        }
    };

    // 드라이버 추가
    const handleAddDriver = async (values) => {
        try {
            const payload = {
                user: {
                    username: values.username,
                    password: values.password,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                },
                phone_number: values.phone_number,
                division_id: values.division_id,
                state: 'ready', // 기본 상태 설정
            };
            await axios.post(`${API_BASE_URL}/drivers/api/drivers/`, payload);
            message.success('Driver added successfully.');
            setIsModalOpen(false);
            fetchDrivers();
            form.resetFields();
        } catch (error) {
            message.error('Failed to add driver.');
        }
    };

    // 검색 필터
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = drivers.filter((driver) =>
            Object.values(driver.user)
                .join(' ')
                .toLowerCase()
                .includes(value)
        );
        setFilteredDrivers(filtered);
    };

    // 테이블 컬럼 정의
    const columns = [
        {
            title: 'Username',
            dataIndex: ['user', 'username'],
            key: 'username',
        },
        {
            title: 'Full Name',
            render: (_, record) => `${record.user.first_name} ${record.user.last_name}`,
        },
        {
            title: 'Email',
            render: (_, record) => record.user.email || 'N/A',
        },
        {
            title: 'Phone Number',
            render: (_, record) => record.phone_number || 'N/A',
        },
        {
            title: 'Division',
            render: (_, record) => record.division_id || 'N/A',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state) => {
                const color =
                    state === 'ready'
                        ? 'green'
                        : state === 'waiting'
                        ? 'orange'
                        : state === 'moving'
                        ? 'blue'
                        : 'red';
                return <Tag color={color}>{state.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => handleDeleteDriver(record.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <ManagerLayout>
            <div className="driver-management">
                <h2>Driver List</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Input
                        placeholder="Search Drivers"
                        value={searchText}
                        onChange={handleSearch}
                        style={{ width: '300px' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                        style={{ width: '120px' }}
                    >
                        Add Driver
                    </Button>
                </div>
                <Table
                    dataSource={filteredDrivers}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {/* 드라이버 추가 모달 */}
                <Modal
                    title="Add New Driver"
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddDriver}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please enter a username.' }]}
                        >
                            <Input placeholder="Enter username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please enter a password.' }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter the first name.' }]}
                        >
                            <Input placeholder="Enter first name" />
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter the last name.' }]}
                        >
                            <Input placeholder="Enter last name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter a valid email.' }]}
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter a phone number.' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                        <Form.Item
                            name="division_id"
                            label="Division"
                            rules={[{ required: true, message: 'Please select a division.' }]}
                        >
                            <Select placeholder="Select division">
                                {DIVISIONS.map((division) => (
                                    <Option key={division} value={division}>
                                        {division}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Add Driver
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ManagerLayout>
    );
};

export default DriverManagement;
