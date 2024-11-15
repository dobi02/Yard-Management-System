import React, {useState} from 'react';
import { Form, Input, Button, message } from 'antd';
import './Login.css'

// 로그인
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        // 서버로 로그인 요청 보내는 곳 (지금은 아님 콘솔로 출력)
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <h1 className='logo'>YMS</h1> {/* 로고 위치 지금은 텍스트로 씀 */}
                <Form
                    name='login'
                    initialValue={{remember: true}}
                    onFinish={handleSubmit}
                    layout='vertical'
                    className='ant-login-form' // css용
                    >
                    <Form.Item
                        name='username'
                        rules={[ {required: true, message: 'Please enter your username!'}]}
                    >
                        <Input
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            /> {/* 아이디 입력 */}
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[ {required: true, message: 'Please enter your password!'}]}
                    >
                        <Input.Password
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
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