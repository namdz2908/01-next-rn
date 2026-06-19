'use client'

import { Button, Modal, Table, notification, Spin, Tag, Pagination } from "antd";
import { DeleteOutlined, EditOutlined, ShopOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import RestaurantForm from "./restaurant.form";
import { fetchRestaurants, deleteRestaurant } from "@/app/actions/restaurant.action";

const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<string, string> = {
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
    fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

function parseHours(hoursStr?: string): Record<string, string> {
    if (!hoursStr) return {};
    try {
        return JSON.parse(hoursStr);
    } catch {
        return {};
    }
}

const RestaurantProfile = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<IRestaurant | null>(null);

    const loadRestaurants = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await fetchRestaurants(page, pageSize);
            if (response.statusCode === 200 && response.data) {
                setRestaurants(response.data.result);
                setPagination({
                    current: response.data.meta.current,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total,
                });
            } else {
                notification.error({ message: 'Failed to load restaurants', description: response.message });
            }
        } catch (error) {
            notification.error({ message: 'Error loading restaurants' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRestaurants(1, 10);
    }, []);

    const handleCreate = () => {
        setSelectedRestaurant(null);
        setModalOpen(true);
    };

    const handleEdit = (record: IRestaurant) => {
        setSelectedRestaurant(record);
        setModalOpen(true);
    };

    const handleDelete = (record: IRestaurant) => {
        Modal.confirm({
            title: 'Delete Restaurant',
            content: `Are you sure you want to delete "${record.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true);
                try {
                    const response = await deleteRestaurant(record._id!);
                    if (response.statusCode === 200) {
                        notification.success({ message: 'Restaurant deleted successfully' });
                        loadRestaurants(pagination.current, pagination.pageSize);
                    } else {
                        notification.error({ message: 'Failed to delete', description: response.message });
                    }
                } catch {
                    notification.error({ message: 'Error deleting restaurant' });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <span style={{ fontWeight: 500 }}>
                    <ShopOutlined style={{ marginRight: 6, color: '#1677ff' }} />
                    {name}
                </span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Operating Hours',
            dataIndex: 'hours',
            key: 'hours',
            width: 240,
            render: (hours?: string) => {
                const h = parseHours(hours);
                return (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {DAYS_OF_WEEK.map(day =>
                            h[day] ? (
                                <Tag key={day} color="blue" style={{ fontSize: 11 }}>
                                    {DAY_LABELS[day]}: {h[day]}
                                </Tag>
                            ) : null
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_: any, record: IRestaurant) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>Manage Restaurants</span>
                <Button type="primary" onClick={handleCreate}>
                    + Add Restaurant
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table
                    bordered
                    dataSource={restaurants}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            </Spin>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => loadRestaurants(page, pageSize)}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50']}
                />
            </div>

            <RestaurantForm
                open={modalOpen}
                restaurant={selectedRestaurant}
                onClose={() => { setModalOpen(false); setSelectedRestaurant(null); }}
                onSuccess={() => loadRestaurants(pagination.current, pagination.pageSize)}
            />
        </>
    );
};

export default RestaurantProfile;
