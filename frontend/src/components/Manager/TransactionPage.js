import React, { useState, useEffect } from 'react';
import { Table, Tag, Select, Input, message } from 'antd';
import ManagerLayout from './ManagerLayout';
import './TransactionPage.css';
import axios from 'axios';

const {Option} = Select;

const API_BASE_URL = 'http://localhost:8000';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]); // 필터링 및 정렬된 데이터
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({}); // 필터 상태
    const [searchText, setSearchText] = useState(''); // 검색 텍스트
    const [sorter, setSorter] = useState({}); // 정렬 상태

    const fetchAllDrivers = async () => {
        try {
            // 모든 드라이버 정보를 가져오는 API 호출
            const response = await axios.get(`${API_BASE_URL}/api/drivers/`);
            // 드라이버 데이터를 매핑 (driver_id -> 이름)
            const driverMap = response.data.reduce((map, driver) => {
                map[driver.id] = `${driver.user.first_name} ${driver.user.last_name}`;
                return map;
            }, {}); // 초기값은 빈 객체 {}
            return driverMap;
        } catch (error) {
            message.error('Failed to load drivers.');
            setLoading(false);
        }
    };

    // 트랜잭션 데이터 불러오기
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            //드라이버 정보 먼저 가져오기
            const driverMap = await fetchAllDrivers();
            const response = await axios.get(`${API_BASE_URL}/transactions/api/transactions/`);
            const transactions = response.data;


            const transactionsWithDriverNames = transactions.map((transaction) => ({
                ...transaction,
                driver_name: driverMap[transaction.driver_id] || 'N/A', // 매핑된 이름 또는 기본값
            }));

            const sortedTransactions = transactionsWithDriverNames.sort(
                (a, b) => new Date(b.transaction_created) - new Date(a.transaction_created)
            );

            setTransactions(sortedTransactions);
            setLoading(false);
        } catch (error) {
            message.error('Failed to load transactions.');
            setLoading(false);
        }
    };

    // 필터 및 정렬 적용 함수
    const applyFiltersAndSorting = () => {
        let updatedData = [...transactions];

        // 필터 적용
        if (filters.status) {
            updatedData = updatedData.filter((item) => item.transaction_status === filters.status);
        }

        // 검색 적용
        if (searchText) {
            updatedData = updatedData.filter((item) =>
                Object.values(item)
                    .join(' ')
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        // 정렬 적용
        if (sorter.field) {
            updatedData.sort((a, b) => {
                const order = sorter.order === 'ascend' ? 1 : -1;
                return a[sorter.field] > b[sorter.field] ? order : -order;
            });
        }

        setFilteredTransactions(updatedData);
    };

    // 필터 변경 핸들러
    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    // 정렬 변경 핸들러
    const handleTableChange = (pagination, tableFilters, tableSorter) => {
        setSorter({ field: tableSorter.field, order: tableSorter.order });
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // 필터 및 정렬 업데이트 시 데이터 재적용
    useEffect(() => {
        applyFiltersAndSorting();
    }, [filters, searchText, sorter, transactions]);

    // 컴포넌트 로드 시 데이터 불러오기
    useEffect(() => {
        fetchTransactions();
    }, []);

    // 테이블 컬럼 정의
    const columns = [
        {
            title: 'Transaction ID',
            dataIndex: 'transaction_id',
            key: 'transaction_id',
            sorter: true,
        },
        {
            title: 'Driver',
            dataIndex: 'driver_name',
            key: 'driver',
            render: (driverName) => driverName || 'N/A',
        },
        {
            title: 'Origin Yard',
            dataIndex: 'origin_yard_id',
            key: 'origin_yard',
            render: (yard) => yard || 'N/A',
        },
        {
            title: 'Destination Yard',
            dataIndex: 'destination_yard_id',
            key: 'destination_yard',
            render: (yard) => yard || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'transaction_status',
            key: 'transaction_status',
            render: (status) => {
                const color =
                    status === 'waiting'
                        ? 'orange'
                        : status === 'accepted'
                        ? 'blue'
                        : status === 'moving'
                        ? 'purple'
                        : status === 'arrive'
                        ? 'green'
                        : 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Created Time',
            dataIndex: 'transaction_created',
            key: 'transaction_created',
            sorter: true,
            render: (time) => new Date(time).toLocaleString(),
        },
    ];

    return (
        <ManagerLayout>
            <div className="transaction-page">
                <h2>Transaction List</h2>
                <div style={{ marginBottom: 20 }}>
                    <Input
                        placeholder="Search Transactions"
                        value={searchText}
                        onChange={handleSearch}
                        style={{ width: 300, marginRight: 20 }}
                    />
                    <Select
                        placeholder="Filter by Status"
                        onChange={(value) => handleFilterChange('status', value)}
                        style={{ width: 200 }}
                        allowClear
                    >
                        <Option value="waiting">Waiting</Option>
                        <Option value="accepted">Accepted</Option>
                        <Option value="moving">Moving</Option>
                        <Option value="arrive">Arrive</Option>
                    </Select>
                </div>
                <Table
                    dataSource={filteredTransactions}
                    columns={columns}
                    rowKey="transaction_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    onChange={handleTableChange}
                />
            </div>
        </ManagerLayout>
    );
};

export default TransactionsPage;
