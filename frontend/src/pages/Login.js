import React, {useState} from 'react';
import { Form, Input, Button, message } from 'antd';
import './Login.css'
import axios from 'axios';

// 로그인
const Login = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        // 서버로 로그인 요청 보내는 곳
        try {
            const response = await axios.post('http://localhost:8000/login/', {
                manager_id : values.manager_id,
                password : values.password,
            });
            alert(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert(error.message);
            }
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h1 className='login-logo'>YMS</h1> {/* 로고 위치 지금은 텍스트로 씀 */}
                <Form
                    name='login'
                    onFinish={handleSubmit}
                    layout='vertical'
                    className='ant-login-form' // css용
                    >
                    <Form.Item
                        name='manager_id'
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
                        <Button type='primary' htmlType='submit' block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;