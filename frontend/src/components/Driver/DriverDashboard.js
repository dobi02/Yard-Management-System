import React, {useEffect, useState} from 'react';
import './DriverDashboard.css'
import DriverLayout from "./DriverLayout";


import {Card, Toast} from "antd-mobile";
import axios from "axios";
import DriverTransactionCard from "./Dashboard/DriverTransactionCard";

const API_BASE_URL = 'http://localhost:8000';

const DriverDashboard = () => {

    const [transaction, setTransaction] = useState(null); // 주문 정보
    const [loading, setLoading] = useState(true); // 로딩중

    useEffect(() => {
        // 드라이버 아이디로 transaction 불러옴
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/transactions/driver/hong`); // 임시
                const data = response.data[0];
                if (data) {
                    setTransaction({
                        id: data.transaction_id,
                        number: `TRX${data.transaction_id}`,
                        originYard: data.origin_yard_id,
                        destination: data.destination_yard_id,
                        details: `From ${data.origin_yard_id} to ${data.destination_yard_id || 'N/A'}`,
                        departureTime: data.departure_time,
                        arrivalTime: data.arrival_time,
                        status: data.transaction_status,
                    });
                }
            } catch (error) {
                Toast.show({
                    icon: 'fail',
                    content: 'Error fetching transaction',
                });
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchTransaction();
    }, []);



    return (
        <DriverLayout>
            <div className="driver-dashboard-container">
                {loading ? (
                    <div className="loading-container">Loading transaction details...</div>
                    ) : (
                        <>
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
                        </>
                    )}
            </div>
        </DriverLayout>
    );
};

export default DriverDashboard;