import React, {useEffect, useState} from 'react';
import './DriverDashboard.css'
import DriverLayout from "./DriverLayout";


import {Card, List, Space, Button, Toast} from "antd-mobile";
import { EnvironmentOutline } from "antd-mobile-icons";
import axios from "axios";
import DriverTransactionCard from "./Dashboard/DriverTransactionCard";

const API_BASE_URL = 'http://localhost:8000';

const DriverDashboard = () => {

    const [transaction, setTransaction] = useState(null); // 주문 정보

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
                        id: data.transaction_id,
                        number: `TRX${data.transaction_id}`,
                        originYard: data.origin_yard_id,
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


    return (
        <DriverLayout>
            <div className="driver-dashboard-container">
                {/* Transaction */}
                <div className="driver-dashboard-card">
                    {
                        transaction ? (
                            <DriverTransactionCard transaction={transaction} />
                        ) : (
                            <Card className="driver-transaction-card">
                                <h3>No Transaction Available</h3>
                                <div className="list-item">
                                    <p>There are no ongoing trips at the moment.</p>
                                </div>

                            </Card>
                        )
                    }
                </div>

                {/* Key Statistics */}
                <Card className="driver-dashboard-card">
                    <h3>Key Statistics</h3>
                    <div className="list-item">
                        <span className="list-item-icon">✔️</span>
                        <span className="list-item-key">Completed Trips:</span>
                        <span className="list-item-text">15</span>
                    </div>
                    <div className="list-item">
                        <span className="list-item-icon">📦</span>
                        <span className="list-item-key">Total Transported:</span>
                        <span className="list-item-text">200 Tons</span>
                    </div>
                </Card>
            </div>
        </DriverLayout>
    );
};

export default DriverDashboard;