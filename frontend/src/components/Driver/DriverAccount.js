import React, {useEffect, useState} from 'react'
import DriverLayout from "./DriverLayout";
import {message, Button} from "antd";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000';

const DriverAccount = () => {
    const username = localStorage.getItem('username');
    const [userInfo, setUserInfo] = useState(null);

        useEffect(() => {
            const fetchUserInfo = async () => {

                try {
                    const response = await axios.get(`${API_BASE_URL}/api/drivers/${username}/`,{
                        // headers: {
                        //     Authorization: `Bearer ${token}`,
                        // },
                    });

                    setUserInfo(response.data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        message.error('Authentication failed. Please log in again.');
                    } else if (error.response && error.response.status === 404) {
                        message.error('User not found.');
                    } else {
                        message.error('An error occurred. Please try again later.');
                    }
                }
            };

            fetchUserInfo();
        }, [username]);

        const updateState = async () => {
            if (!userInfo) return;

            const newState = userInfo.state === 'off_work' ? 'ready' : 'off_work';

            try {
                const response = await axios.put(`${API_BASE_URL}/api/drivers/${username}/`, {
                    state: newState
                });

                setUserInfo({ ...userInfo, state: response.data.state });
                message.success(`State updated to '${response.data.state}' successfully.`);
            } catch (error) {
                message.error('Failed to update state. Please try again later.');
            }
        };

    return (
        <DriverLayout>
            <div>
                  {userInfo ? (
                    <>
                        <p><strong>Username:</strong> {userInfo.user?.username}</p>
                        <p><strong>Email:</strong> {userInfo.user?.email}</p>
                        <p><strong>Phone Number:</strong> {userInfo.phone_number}</p>
                        <p><strong>Division:</strong> {userInfo.division_id}</p>
                        <p><strong>State:</strong> {userInfo.state}</p>

                        <Button type="primary" onClick={updateState}>
                            {userInfo.state === 'off_work' ? 'Get Ready' : 'Off Work'}
                        </Button>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </DriverLayout>
    );
};

export default DriverAccount;