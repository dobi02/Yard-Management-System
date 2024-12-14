import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Space, Toast } from 'antd-mobile';
import DriverLayout from "./DriverLayout";
import './DriverTransaction.css';
import {useParams} from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000';

const DriverTransaction = () => {
    const [transaction, setTransaction] = useState(null);
    const [transaction_id, setTransactionId] = useState(null);
    const [driverState, setDriverState] = useState(null);
    const {username} = useParams();

    useEffect(() => {
    const fetchInfo = async () => {
        try {
            const [transactionResponse, driverResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/transactions/driver/${username}/`),
                axios.get(`${API_BASE_URL}/api/drivers/${username}/`),
            ]);

            const transactionData = transactionResponse.data;
            if (Array.isArray(transactionData) && transactionData.length > 0) {
                const firstTransaction = transactionData[0];
                const summarizedData = {
                    transaction_id: firstTransaction.transaction_id,
                    number: `TRX${firstTransaction.transaction_id}`,
                    truck: firstTransaction.truck_id,
                    chassis: firstTransaction.chassis_id,
                    container: firstTransaction.container_id,
                    trailer: firstTransaction.trailer_id,
                    destination: firstTransaction.destination_yard_id,
                    originYard: firstTransaction.origin_yard_id,
                    details: `From ${firstTransaction.origin_yard_id} to ${firstTransaction.destination_yard_id || 'N/A'}`,
                    departureTime: firstTransaction.departure_time,
                    arrivalTime: firstTransaction.arrival_time,
                    status: firstTransaction.transaction_status,
                };
                setTransaction(summarizedData);
                setTransactionId(firstTransaction.transaction_id);
            } else {
                // 트랜잭션이 없을 경우 초기화
                setTransaction(null);
                setTransactionId(null);
            }

            setDriverState(driverResponse.data.state);
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: 'Error fetching data',
            });
        }
    };

    fetchInfo();
}, []);


    const handleStatusChange = async (newStatus) => {
    if (!transaction) return;

    try {
        // 트랜잭션 상태 업데이트 API 호출
        await axios.put(`${API_BASE_URL}/api/transactions/driver/${username}/${transaction_id}/`, {
            transaction_status: newStatus,
        });


        // 트랜잭션 상태 업데이트
        setTransaction((prev) => ({ ...prev, status: newStatus }));
        Toast.show({
            icon: 'success',
            content: `Transaction status updated to: ${newStatus}`,
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        Toast.show({
            icon: 'fail',
            content: 'Error updating transaction status',
        });
    }
};



    const renderActionButtons = () => {
        if (!transaction || !driverState) return null;

        const { status } = transaction;

        const isDriverUnavailable = driverState === 'off_work';

        switch (status) {
            case 'waiting':
                return (
                    <Button
                        color="primary"
                        className="accept-button"
                        onClick={() => handleStatusChange('accepted')}
                        disabled={isDriverUnavailable || driverState !== 'responding'}
                    >
                        Accept
                    </Button>
                );
            case 'accepted':
                return (
                    <Button
                        color="primary"
                        className="move-button"
                        onClick={() => handleStatusChange('moving')}
                    >
                        Start Moving
                    </Button>
                );
            case 'moving':
                return (
                    <Button
                        color="primary"
                        className="finished-button"
                        onClick={() => handleStatusChange('finished')}
                    >
                        Confirm Arrival
                    </Button>
                );
            case 'finished':
                return (
                    <Button color="success" className="completed-button" disabled>
                        Completed
                    </Button>
                );
            case 'canceled':
                return (
                    <Button color="danger" className="canceled-button" disabled>
                        Canceled
                    </Button>
                );
            default:
                return null;
        }
    };


    return (
        <DriverLayout>
            <div className="transaction-container">
                {transaction ? (
                    <Card className="transaction-card">
                        <div className="transaction-details">
                            <h3 className="transaction-number">Transaction #{transaction.number}</h3>
                            {transaction.truck && <p>Truck: {transaction.truck}</p>}
                            {transaction.chassis && <p>Chassis: {transaction.chassis}</p>}
                            {transaction.container && <p>Container: {transaction.container}</p>}
                            {transaction.trailer && <p>Trailer: {transaction.trailer}</p>}
                            {transaction.destination && <p>Destination Yard: {transaction.destination}</p>}
                            <p>Details: {transaction.details}</p>
                            <p>Departure Time: {transaction.departureTime}</p>
                            <p>Arrival Time: {transaction.arrivalTime}</p>
                            <p>Status: {transaction.status}</p>
                            <Space direction="horizontal" className="transaction-buttons">
                                {renderActionButtons()}
                                {transaction.status !== 'canceled' && (
                                    <Button
                                        color="danger"
                                        onClick={() => handleStatusChange('canceled')}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Card>
                ) : (
                    <Card className="transaction-card empty-card">
                        <div className="transaction-details">
                            <h3 className="transaction-number">No Transactions Available</h3>
                            <p>Currently, there are no transactions assigned.</p>
                        </div>
                    </Card>
                )}
            </div>
        </DriverLayout>
    );
};
export default DriverTransaction;
