import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import { Descriptions, Spin, Button, Tag, message } from 'antd';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const TransactionDetailPage = () => {
    const { transactionId } = useParams(); // Get transactionId from the URL
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [manager, setManager] = useState([]); // 샤시 목록
    const navigate = useNavigate();
    const location = useLocation();

    const driverName = location.state.driver;

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/transactions/api/transactions/${transactionId}/`); // Fetch details by ID
                if (response.data.manager_id != null){
                    const managers = await axios.get(`${API_BASE_URL}/api/managers/${response.data.manager_id}/`);
                    setManager(managers.data);
                }

                setTransaction(response.data);



                setLoading(false);
            } catch (error) {
                message.error('Failed to load transaction details.');
                setLoading(false);
            }
        };


        fetchTransactionDetails();
    }, [transactionId]);

    const handleFinish = async () => {
        try {
            await axios.put(`${API_BASE_URL}/transactions/api/transactions/driver/1234/${transactionId}/`, {
                transaction_status: 'finished',
            }); // Update the status to "finished"
            message.success('Transaction finished successfully.');
            window.location.reload();
        } catch (error) {
            message.error('Failed to finish the transaction.');
        }
    };



    const handleCancelAction = async () => {
        try {
            await axios.put(`${API_BASE_URL}/transactions/api/transactions/driver/1234/${transactionId}/`, {
                transaction_status: 'canceled',
            }); // Update the status to "canceled   "
            message.success('Transaction canceled successfully.');
            window.location.reload();
        } catch (error) {
            message.error('Failed to cancel the transaction.');
        }
    };


    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!transaction) {
        return <p>Transaction not found.</p>;
    }

    return (
        <div style={{padding: '20px', backgroundColor: '#fff'}}>
            <h2>Transaction Details</h2>
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Transaction ID">{transaction.transaction_id}</Descriptions.Item>
                <Descriptions.Item label="Driver">
                    {driverName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Origin Yard">{transaction.origin_yard_id || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Destination Yard">
                    {transaction.destination_yard_id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag
                        color={
                            transaction.transaction_status === 'waiting'
                                ? 'orange'
                                : transaction.transaction_status === 'accepted'
                                    ? 'blue'
                                    : transaction.transaction_status === 'moving'
                                        ? 'purple'
                                        : transaction.transaction_status === 'arrive'
                                            ? 'green'
                                            : 'red'
                        }
                    >
                        {transaction.transaction_status.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Manager">
                    {manager?.user?.first_name || 'N/A'} {manager?.user?.last_name || ' '}
                </Descriptions.Item>
                <Descriptions.Item label="Created Time">
                    {new Date(transaction.transaction_created).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated Time">
                    {new Date(transaction.transaction_updated).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Departure Time">
                    {new Date(transaction.departure_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Real Departure Time">
                    {new Date(transaction.departure_time_real).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Arrival Time">
                    {new Date(transaction.arrival_time).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Real Arrival Time">
                    {new Date(transaction.arrival_time_real).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Truck ID">
                    {transaction.truck_id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Chassis ID">
                    {transaction.chassis_id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Container ID">
                    {transaction.container_id || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Trailer ID">
                    {transaction.trailer_id || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label="Additional Info">
                    {transaction.additional_info || 'No additional information provided.'}
                </Descriptions.Item>
            </Descriptions>

            <div style={{marginTop: '20px'}}>
                <Button onClick={() => navigate(-1)} style={{marginRight: 10}}>Go Back</Button>

                <Button
                    style={{marginRight: 10}}
                    onClick={handleFinish}
                    disabled={
                    !(transaction.transaction_status === 'arrive')}>
                    Finish
                </Button>


                <Button
                    type="default"
                    onClick={handleCancelAction}
                    disabled={
                        !(transaction.transaction_status === 'waiting' || transaction.transaction_status === 'accepted')
                    }
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default TransactionDetailPage;
