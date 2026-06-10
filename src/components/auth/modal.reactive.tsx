'use client'

import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { useHasMounted } from "@/utils/customHook";
import { Modal, Steps } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';

const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);
    const hasMounted = useHasMounted();
    const [form] = Form.useForm();
    const [userId, setUserId] = useState("");

    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("email", userEmail);
        }
    }, [userEmail])

    useEffect(() => {
        if (isModalOpen) {
            setCurrent(0);
        }
    }, [isModalOpen])

    if (!hasMounted) return <></>;
    // console.log(">>> check user email: ", userEmail);

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
                email
            }
        })

        if (res?.data) {
            setUserId(res?.data?._id)
            setCurrent(1);
        } else {
            notification.error({
                message: "Resend thất bại!",
                description: res?.message
            })
        }
    }

    const onFinishStep1 = async (values: any) => {
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                code, _id: userId
            }
        })

        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Code không hợp lệ!",
                // description: res?.message
            })
        }
    }

    return (
        <>
            <Modal
                title="Kích hoạt tài khoản"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Login',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Done',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 &&
                    <>
                        <div style={{ margin: "15px 0px" }}>
                            <p>Tài khoản của bạn chưa được kích hoạt!</p>
                            <p>Vui lòng click vào nút Resend phía dưới để hệ thống gửi lại code tới email của bạn!</p>
                        </div>

                        <Form
                            name="basic"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label=""
                                name="email"
                            >
                                <Input disabled value={userEmail} />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 1 &&
                    <>
                        <div style={{ margin: "15px 0px" }}>
                            <p>Vui lòng nhập mã xác nhận</p>
                        </div>

                        <Form
                            name="basic"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mã xác nhận của bạn"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Kích hoạt
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 2 &&
                    <>
                        <div style={{ margin: "15px 0px" }}>
                            <p>Tài khoản của bạn đã được kích hoạt thành công! Vui lòng đăng nhập lại</p>
                        </div>
                    </>
                }
            </Modal>
        </>
    )
};

export default ModalReactive;