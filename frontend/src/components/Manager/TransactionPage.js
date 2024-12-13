import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import ManagerLayout from './ManagerLayout';
import './TransactionPage.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // 트랜잭션 데이터 불러오기
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/api/transactions/`);
            const sortedTransactions = response.data.sort(
                (a, b) => new Date(b.transaction_created) - new Date(a.transaction_created)
            );
            setTransactions(sortedTransactions);
            setLoading(false);
        } catch (error) {
            message.error('Failed to load transactions.');
            setLoading(false);
        }
    };

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
        },
        {
            title: 'Driver',
            dataIndex: ['driver_id', 'user', 'username'],
            key: 'driver',
            render: (driver) => driver || 'N/A',
        },
        {
            title: 'Origin Yard',
            dataIndex: ['origin_yard_id', 'yard_id'],
            key: 'origin_yard',
            render: (yard) => yard || 'N/A',
        },
        {
            title: 'Destination Yard',
            dataIndex: ['destination_yard_id', 'yard_id'],
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
            render: (time) => new Date(time).toLocaleString(),
        },
    ];

    return (
        <ManagerLayout>
            <div className="transaction-page">
                <h2>Transaction List</h2>
                <Table
                    dataSource={transactions}
                    columns={columns}
                    rowKey="transaction_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </ManagerLayout>
    );
};

export default TransactionsPage;
