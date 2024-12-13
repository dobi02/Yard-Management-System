import React, { useState, useEffect } from 'react';
import { Card, Button, message, Select } from 'antd';
import MainLayout from './ManagerLayout';
import './TransactionPage.css';
import axios from 'axios';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState(null); // 필터 상태

    useEffect(() => {
        fetchTransactions();
    }, []);

    // 트랜잭션 데이터 가져오기
    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/api/list`);
            setTransactions(response.data);
        } catch (error) {
            message.error('Failed to load transactions.');
        }
    };

    // 필터 핸들러
    const handleFilterChange = (value) => {
        setFilter(value);
    };

    // 트랜잭션 처리 (In 트랜잭션 수락)
    const handleAcceptTransaction = async (transactionId) => {
        try {
            await axios.post(`${API_BASE_URL}/transactions/api/accept/${transactionId}/`);
            message.success('Transaction accepted successfully.');
            fetchTransactions(); // 목록 갱신
        } catch (error) {
            message.error('Failed to accept transaction.');
        }
    };

    // 필터링된 트랜잭션 목록
    const filteredTransactions = filter
        ? transactions.filter((transaction) => transaction.type === filter)
        : transactions;

    return (
        <MainLayout>
            <div className="transactions-header">
                <h2>In/Out Transactions</h2>
                <Select
                    placeholder="Filter by type"
                    onChange={handleFilterChange}
                    style={{ width: '200px', marginBottom: '10px' }}
                    allowClear
                >
                    <Option value="in">In Transactions</Option>
                    <Option value="out">Out Transactions</Option>
                </Select>
            </div>

            {/* In/Out 트랜잭션 카드 리스트 */}
            <div className="transactions-list">
                {filteredTransactions.map((transaction, index) => (
                    <Card
                        key={`transaction-${index}`}
                        className="transaction-card"
                        title={`Transaction: ${transaction.type.toUpperCase()}`}
                        extra={
                            transaction.type === 'in' && (
                                <Button
                                    type="primary"
                                    onClick={() => handleAcceptTransaction(transaction.id)}
                                >
                                    Accept
                                </Button>
                            )
                        }
                    >
                        <p><b>Driver:</b> {transaction.driver}</p>
                        <p><b>Truck:</b> {transaction.truck || 'N/A'}</p>
                        {transaction.chassis && <p><b>Chassis:</b> {transaction.chassis}</p>}
                        {transaction.container && <p><b>Container:</b> {transaction.container}</p>}
                        {transaction.trailer && <p><b>Trailer:</b> {transaction.trailer}</p>}
                        <p><b>From Yard:</b> {transaction.from_yard || 'N/A'}</p>
                        <p><b>To Yard:</b> {transaction.to_yard || 'N/A'}</p>
                        <p><b>Date:</b> {new Date(transaction.date).toLocaleString()}</p>
                    </Card>
                ))}
            </div>
        </MainLayout>
    );
};

export default TransactionsPage;
