'use client'

import { Button, Card, Form, Input, Select, notification, Result, Typography } from 'antd';
import { SendOutlined, MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { submitGuestFeedback } from '@/app/actions/feedback.action';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const feedbackTypes = [
    { value: 'suggestion', label: '💡 Góp ý' },
    { value: 'complaint', label: '⚠️ Khiếu nại' },
    { value: 'question', label: '❓ Câu hỏi' },
    { value: 'other', label: '📝 Khác' },
];

export default function GuestFeedbackPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onFinish = async (values: ICreateFeedbackRequest) => {
        setLoading(true);
        try {
            const response = await submitGuestFeedback(values);
            if (response.statusCode === 201) {
                setSubmitted(true);
                form.resetFields();
            } else {
                notification.error({
                    message: 'Gửi phản hồi thất bại',
                    description: Array.isArray(response.message) ? response.message.join(', ') : response.message,
                });
            }
        } catch {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Vui lòng thử lại sau',
            });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Card style={{ maxWidth: 500, width: '100%', margin: 16, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                    <Result
                        status="success"
                        title="Cảm ơn bạn đã gửi phản hồi!"
                        subTitle="Chúng tôi đã nhận được phản hồi của bạn và sẽ xem xét trong thời gian sớm nhất."
                        extra={[
                            <Button type="primary" key="again" onClick={() => setSubmitted(false)}>
                                Gửi phản hồi khác
                            </Button>,
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 16 }}>
            <Card style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <MessageOutlined style={{ fontSize: 48, color: '#667eea' }} />
                    <Title level={2} style={{ marginTop: 12, marginBottom: 4 }}>Gửi Phản Hồi</Title>
                    <Paragraph type="secondary">Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện dịch vụ</Paragraph>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                            <Input placeholder="Nguyễn Văn A" size="large" />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                            <Input placeholder="email@example.com" size="large" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="phone" label="Số điện thoại">
                            <Input placeholder="0912 345 678" size="large" />
                        </Form.Item>
                        <Form.Item name="type" label="Loại phản hồi" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                            <Select placeholder="Chọn loại" options={feedbackTypes} size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item name="subject" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input placeholder="Tiêu đề phản hồi" size="large" />
                    </Form.Item>

                    <Form.Item name="message" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                        <TextArea rows={5} placeholder="Mô tả chi tiết phản hồi của bạn..." showCount maxLength={1000} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />} size="large" block
                            style={{ height: 48, fontSize: 16, borderRadius: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            Gửi phản hồi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
