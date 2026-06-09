'use client'
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { authenticate } from '@/utils/action';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const { username, password } = values;
        // trigger login
        const response = await authenticate(username, password);
        if (response?.error) {
            notification.error({
                message: "Error login",
                description: response?.error
            })
            if (response?.code === 2) {
                router.push('/verify');
            }
        } else { // Trường hợp thành công không trả về error
            // redirect to /dashboard
            router.push('/dashboard');
        }

        console.log(">>> check response", response);
        // console.log("Check values: ", values);
        // const data = await signIn("credentials", { email, password, redirect: false });
        // console.log("Data: ", data);
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>



                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link href={"/auth/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default Login;