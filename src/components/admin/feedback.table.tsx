'use client'

import { Button, Table, Modal, notification, Spin, Pagination, Tag, Select, Card, Statistic, Row, Col } from "antd";
import { DeleteOutlined, EyeOutlined, MessageOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import FeedbackDetailModal from "./feedback.detail.modal";
import { fetchFeedbacks, fetchFeedbackStats, deleteFeedback } from "@/app/actions/feedback.action";

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

const FeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [stats, setStats] = useState<IFeedbackStats>({ total: 0, pending: 0, read: 0, replied: 0 });
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);

    const loadFeedbacks = async (page: number = 1, pageSize: number = 10, status?: string) => {
        setLoading(true);
        try {
            const response = await fetchFeedbacks(page, pageSize, status);
            if (response.statusCode === 200 && response.data) {
                setFeedbacks(response.data.result);
                setPagination({
                    current: response.data.meta.current,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total,
                });
            } else {
                notification.error({
                    message: "Lỗi tải danh sách",
                    description: response.message,
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi hệ thống",
                description: (error as any)?.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await fetchFeedbackStats();
            if (response.statusCode === 200 && response.data) {
                setStats(response.data);
            }
        } catch { /* ignore */ }
    };

    useEffect(() => {
        loadFeedbacks(1, 10, statusFilter);
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStatusFilterChange = (value: string | undefined) => {
        setStatusFilter(value);
        loadFeedbacks(1, pagination.pageSize, value);
    };

    const handleViewDetail = (feedback: IFeedback) => {
        setSelectedFeedback(feedback);
        setDetailOpen(true);
    };

    const handleDelete = (feedback: IFeedback) => {
        Modal.confirm({
            title: "Xóa phản hồi",
            content: `Bạn có chắc chắn muốn xóa phản hồi từ "${feedback.name}"?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: async () => {
                setLoading(true);
                try {
                    const response = await deleteFeedback(feedback._id!);
                    if (response.statusCode === 200) {
                        notification.success({
                            message: "Xóa thành công",
                        });
                        loadFeedbacks(pagination.current, pagination.pageSize, statusFilter);
                        loadStats();
                    } else {
                        notification.error({
                            message: "Xóa thất bại",
                            description: response.message,
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi hệ thống",
                        description: (error as any)?.message,
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            width: 140,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: string) => {
                const info = typeLabels[type] || typeLabels.other;
                return <Tag color={info.color}>{info.text}</Tag>;
            },
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'subject',
            key: 'subject',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const info = statusLabels[status] || statusLabels.pending;
                return <Tag color={info.color}>{info.text}</Tag>;
            },
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : '—',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 140,
            render: (_: any, record: IFeedback) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        Xem
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng phản hồi"
                            value={stats.total}
                            prefix={<MessageOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Chờ xử lý"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã đọc"
                            value={stats.read}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã phản hồi"
                            value={stats.replied}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
            }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>Quản lý phản hồi từ khách</span>
                <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    style={{ width: 200 }}
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    options={[
                        { value: 'pending', label: '🕐 Chờ xử lý' },
                        { value: 'read', label: '👁 Đã đọc' },
                        { value: 'replied', label: '✅ Đã phản hồi' },
                    ]}
                />
            </div>

            <Spin spinning={loading}>
                <Table
                    bordered
                    dataSource={feedbacks}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 1100 }}
                />
            </Spin>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                        loadFeedbacks(page, pageSize, statusFilter);
                    }}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50']}
                />
            </div>

            <FeedbackDetailModal
                open={detailOpen}
                feedback={selectedFeedback}
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedFeedback(null);
                }}
                onSuccess={() => {
                    loadFeedbacks(pagination.current, pagination.pageSize, statusFilter);
                    loadStats();
                }}
            />
        </>
    );
};

export default FeedbackTable;
