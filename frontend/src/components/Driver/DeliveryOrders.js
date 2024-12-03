import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Space, Toast } from 'antd-mobile';
import DriverLayout from "./DriverLayout";
import './DeliveryOrders.css';

const DeliveryOrders = () => {
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        // 드라이버 아이디로 transaction 불러옴
        const fetchTransaction = async () => {
            try {
                const response = await axios.get('/api/transactions/', {
                    // params: {
                    //     driver_id: 'current_driver_id'
                    // }
                });
                const data = response.data[0]; // Assuming only one transaction is fetched
                if (data) {
                    const summarizedData = {
                        id: data.transaction_id,
                        number: `TRX${data.transaction_id}`,
                        truck: data.truck_id,
                        chassis: data.chassis_id,
                        container: data.container_id,
                        trailer: data.trailer_id,
                        destination: data.destination_yard_id,
                        details: `From ${data.origin_yard_id} to ${data.destination_yard_id || 'N/A'}`,
                        departureTime: data.departure_time,
                        arrivalTime: data.arrival_time,
                    };
                    setTransaction(summarizedData);
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
            content: 'Order accepted! Please confirm on the Status tab.'
        })
    }



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
                                <Button color="primary" className="accept-button">
                                    Accept
                                </Button>
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

export default DeliveryOrders;
