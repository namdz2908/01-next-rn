'use client'

import { Modal, Form, Input, Button, Descriptions, Tag, notification, Space, Typography } from 'antd';
import { SendOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { replyFeedback, updateFeedbackStatus } from '@/app/actions/feedback.action';

const { TextArea } = Input;
const { Text } = Typography;

const typeLabels: Record<string, { text: string; color: string }> = {
    suggestion: { text: 'Góp ý', color: 'blue' },
    complaint: { text: 'Khiếu nại', color: 'red' },
    question: { text: 'Câu hỏi', color: 'orange' },
    other: { text: 'Khác', color: 'default' },
};

const statusLabels: Record<string, { text: string; color: string }> = {
    pending: { text: 'Chờ xử lý', color: 'gold' },
    read: { text: 'Đã đọc', color: 'blue' },
    replied: { text: 'Đã phản hồi', color: 'green' },
};

interface FeedbackDetailModalProps {
    open: boolean;
    feedback: IFeedback | null;
    onClose: () => void;
    onSuccess: () => void;
}

const FeedbackDetailModal = ({ open, feedback, onClose, onSuccess }: FeedbackDetailModalProps) => {
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReply = async () => {
        if (!feedback?._id || !replyText.trim()) {
            notification.warning({ message: 'Vui lòng nhập nội dung phản hồi' });
            return;
        }
        setLoading(true);
        try {
            const response = await replyFeedback(feedback._id, replyText.trim());
            if (response.statusCode === 201 || response.statusCode === 200) {
                notification.success({ message: 'Phản hồi thành công' });
                setReplyText('');
                onSuccess();
                onClose();
            } else {
                notification.error({ message: 'Phản hồi thất bại', description: response.message });
            }
        } catch {
            notification.error({ message: 'Lỗi hệ thống' });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async () => {
        if (!feedback?._id) return;
        setLoading(true);
        try {
            const response = await updateFeedbackStatus(feedback._id, 'read');
            if (response.statusCode === 200) {
                notification.success({ message: 'Đã đánh dấu đã đọc' });
                onSuccess();
                onClose();
            } else {
                notification.error({ message: 'Cập nhật thất bại', description: response.message });
            }
        } catch {
            notification.error({ message: 'Lỗi hệ thống' });
        } finally {
            setLoading(false);
        }
    };

    const typeInfo = typeLabels[feedback?.type || 'other'] || typeLabels.other;
    const statusInfo = statusLabels[feedback?.status || 'pending'] || statusLabels.pending;

    return (
        <Modal
            title="Chi tiết phản hồi"
            open={open}
            onCancel={() => { setReplyText(''); onClose(); }}
            footer={null}
            width={680}
        >
            {feedback && (
                <div>
                    <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Họ tên">{feedback.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{feedback.email}</Descriptions.Item>
                        <Descriptions.Item label="SĐT">{feedback.phone || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Loại">
                            <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày gửi">
                            {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : '—'}
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Tiêu đề:</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 6, marginTop: 4 }}>
                            {feedback.subject}
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Nội dung:</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 6, marginTop: 4, whiteSpace: 'pre-wrap' }}>
                            {feedback.message}
                        </div>
                    </div>

                    {feedback.adminReply && (
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ color: '#52c41a' }}>Phản hồi của Admin:</Text>
                            <div style={{ padding: '8px 12px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, marginTop: 4, whiteSpace: 'pre-wrap' }}>
                                {feedback.adminReply}
                            </div>
                            {feedback.repliedAt && (
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                    Phản hồi lúc: {new Date(feedback.repliedAt).toLocaleString('vi-VN')}
                                </Text>
                            )}
                        </div>
                    )}

                    {feedback.status !== 'replied' && (
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                            <Text strong>Phản hồi:</Text>
                            <TextArea
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Nhập nội dung phản hồi cho khách..."
                                style={{ marginTop: 8 }}
                            />
                            <Space style={{ marginTop: 12 }}>
                                <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={handleReply} disabled={!replyText.trim()}>
                                    Gửi phản hồi
                                </Button>
                                {feedback.status === 'pending' && (
                                    <Button icon={<EyeOutlined />} loading={loading} onClick={handleMarkAsRead}>
                                        Đánh dấu đã đọc
                                    </Button>
                                )}
                            </Space>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default FeedbackDetailModal;
