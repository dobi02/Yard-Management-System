import React, {useState} from 'react';
import { Form, Input, Button, message, Radio } from 'antd';
import { useNavigate  } from 'react-router-dom';
import './Login.css'
import axios from 'axios';

// 로그인
const Login = () => {
    const [userType, setUserType] = useState(null); // 유저 타입 변수
    const navigate = useNavigate (); //

    // 사용자 유형 번경
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (values) => {
        // 서버로 로그인 요청 보내는 곳
        try {
            let response; // 변수 선언

            // manager or driver 분리
            if (userType === 'manager') {
                response = await axios.post('http://localhost:8000/managers/api/login/', {
                    username: values.username,
                    password: values.password,
                });
            } else if (userType === 'driver') {
                // 아직 없음
                response = await axios.post('http://localhost:8000/drivers/api/login/', {
                    username: values.username,
                    password: values.password,
                });
            } else {
                message.error('Please select a user type.');
                return;
            }
            // 성공, 토큰 로컬 스토리지 저장
            localStorage.setItem('authToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            message.success(response.data.message);

            // 유저 타입에 따라 페이지 이동
            if (userType === 'manager') {
                navigate('/manager/dashboard/');
            } else if (userType === 'driver') {
                navigate(('/driver/dashboard/'))
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
