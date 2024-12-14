import React, {useState} from 'react';
import { Form, Input, Button, message, Radio } from 'antd';
import { useNavigate  } from 'react-router-dom';
import './Login.css'
import axios from 'axios';

// 로그인
const Login = () => {
    const [userType, setUserType] = useState(null); // 유저 타입 변수
    const navigate = useNavigate (); //
    const API_URLS = {
        manager: 'http://localhost:8000/managers/api/login/',
        driver: 'http://localhost:8000/drivers/api/login/',
    };

    // 사용자 유형 번경
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };


    // 공통 API 호출 함수
    const loginUser = async (userType, username, password) => {
        if (!API_URLS[userType]) {
            throw new Error('Invalid user type');
        }
        const response = await axios.post(API_URLS[userType], {
            username,
            password,
        });
        return response.data;
    };

    const handleSubmit = async (values) => {
        // 서버로 로그인 요청 보내는 곳
        try {
            // 사용자 유형 확인
            if (!userType) {
                message.error('Please select a user type.');
                return;
            }

            // 사용자 로그인
            const data = await loginUser(userType, values.username, values.password);

            // 토큰 저장
            localStorage.setItem('authToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('username', values.username);

            // 성공 메시지
            message.success(data.message);

            // 사용자 유형에 따라 리다이렉트
            if (userType === 'manager') {
                window.location.href = '/manager/dashboard';
            } else if (userType === 'driver') {
                window.location.href = '/driver/dashboard';
            }

        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error(error.message);
            }
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h1 className='login-logo'>YMS</h1> {/* 로고 위치 지금은 텍스트로 씀 */}
                <Radio.Group
                    onChange={handleUserTypeChange}
                    value={userType}
                    className="user-type-radio"
                >
                    <Radio value="manager">Manager</Radio>
                    <Radio value="driver">Driver</Radio>
                </Radio.Group>
                <Form
                    name='login'
                    onFinish={handleSubmit}
                    layout='vertical'
                    className='ant-login-form' // css용
                    >
                    <Form.Item
                        name='username'
                        rules={[ {required: true, message: 'Please enter your id!'}]}
                    >
                        <Input placeholder='Username' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[ {required: true, message: 'Please enter your password!'}]}
                    >
                        <Input.Password placeholder='Password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary'
                                htmlType='submit'
                                block
                                disabled={userType === null}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
