import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Space, Toast } from 'antd-mobile';
import DriverLayout from "./DriverLayout";
import './DriverTransaction.css';

const API_BASE_URL = 'http://localhost:8000';

const DriverTransaction = () => {
    const [transaction, setTransaction] = useState(null);
    const [transaction_id, setTransactionId] = useState(null);

    useEffect(() => {
        // 드라이버 아이디로 transaction 불러옴
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/transactions/`, {
                    // params: {
                    //     driver_id: 'current_driver_id'
                    // }
                });

                const data = response.data[0];
                if (data) {
                    const summarizedData = {
                        transaction_id: data.transaction_id,
                        number: `TRX${data.transaction_id}`,
                        truck: data.truck_id,
                        chassis: data.chassis_id,
                        container: data.container_id,
                        trailer: data.trailer_id,
                        destination: data.destination_yard_id,
                        originYard: data.origin_yard_id,
                        details: `From ${data.origin_yard_id} to ${data.destination_yard_id || 'N/A'}`,
                        departureTime: data.departure_time,
                        arrivalTime: data.arrival_time,
                        status: data.transaction_status,
                    };
                    setTransaction(summarizedData);
                    setTransactionId(data.transaction_id);
                }
            } catch (error) {
                Toast.show({
                    icon: 'fail',
                    content: 'Error fetching transaction',
                });
            }
        };

        fetchTransaction();
    }, []);

    const handleAccept = () => {
        Toast.show({
            icon: 'success',
            content: 'Transaction accepted! Please confirm on the Status tab.'
        })
    }

    const handleStatusChange = async (newStatus) => {
        if (!transaction) return;

        try {
            await axios.patch(`${API_BASE_URL}/api/transactions/${transaction_id}/`, {
                transaction_status: newStatus
            });
            setTransaction((prev) => ({ ...prev, status: newStatus }));
            Toast.show({
                icon: 'success',
                content: `Transaction status update to: ${newStatus}`,
            });
        } catch (error) {
            Toast.show({
            icon: 'fail',
            content: 'Error updating transaction status',
        });
        }
    }

    const renderActionButtons = () => {
        if (!transaction) return null;

        const { status } = transaction;

        switch (status) {
            case 'waiting':
                return (
                    <Button
                        color="primary"
                        className="accept-button"
                        onClick={() => handleStatusChange('accepted')}
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
                        className="arrive-button"
                        onClick={() => handleStatusChange('arrive')}
                    >
                        Confirm Arrival
                    </Button>
                );
            case 'arrive':
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
