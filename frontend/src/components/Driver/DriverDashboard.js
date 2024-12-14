import React, {useEffect, useState} from 'react';
import './DriverDashboard.css'
import DriverLayout from "./DriverLayout";

import {Card, Toast} from "antd-mobile";
import axios from "axios";

import DriverTransactionCard from "./Dashboard/DriverTransactionCard";
import DriverInfoCard from "./Dashboard/DriverInfoCard";

const API_BASE_URL = 'http://localhost:8000';

const DriverDashboard = () => {

    const username = localStorage.getItem('username');
    const [userInfo, setUserInfo] = useState(null); // 유저 정보
    const [transaction, setTransaction] = useState(null); // 주문 정보
    const [loading, setLoading] = useState(true); // 로딩

    useEffect(() => {

        // 병렬 데이터 로드
        const fetchData = async () => {
            try {
                // 병렬로 두 API 호출
                const [userResponse, transactionResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/drivers/${username}/`),
                    axios.get(`${API_BASE_URL}/api/transactions/driver/${username}`)
                ]);

                // 드라이버 정보 처리
                const userData = userResponse.data;
                if (userData) {
                    setUserInfo({
                        username: userData.user.username,
                        firstname: userData.user.first_name,
                        lastname: userData.user.last_name,
                        fullname: `${userData.user.first_name} ${userData.user.last_name}`,
                        division: userData.division_id,
                        state: userData.state,
                    });
                }

                // 트랜잭션 정보 처리
                const transactionData = transactionResponse.data[0];
                if (transactionData) {
                    setTransaction({
                        id: transactionData.transaction_id,
                        number: `TRX${transactionData.transaction_id}`,
                        originYard: transactionData.origin_yard_id,
                        destination: transactionData.destination_yard_id,
                        details: `From ${transactionData.origin_yard_id} to ${transactionData.destination_yard_id || 'N/A'}`,
                        departureTime: transactionData.departure_time,
                        arrivalTime: transactionData.arrival_time,
                        status: transactionData.transaction_status,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                Toast.show({
                    icon: 'fail',
                    content: 'Error fetching data. Please try again later.',
                });
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchData();
    }, [username]);

    // 로딩 중일 때 렌더링
    if (loading) {
        return (
            <DriverLayout>
                <div className="loading-container">Loading details...</div>
            </DriverLayout>
        );
    }

    return (
        <DriverLayout>
            <div className="driver-dashboard-container">
                <div className="driver-dashboard-card">
                    {/* 드라이버 정보 카드 */}
                    {userInfo ? (
                        <DriverInfoCard userInfo={userInfo} />
                    ) : (
                        <Card>
                            <h3>No Driver Info</h3>
                            <div className="list-item">
                                <p>There are no Driver Info.</p>
                            </div>
                        </Card>
                    )}

                    {/* 트랜잭션 카드 */}
                    {transaction ? (
                        <DriverTransactionCard transaction={transaction} />
                    ) : (
                        <Card className="driver-transaction-card">
                            <h3>No Transaction Available</h3>
                            <div className="list-item">
                                <p>There are no ongoing trips at the moment.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
};

export default DriverDashboard;