'use client'

import { Button, Table, Modal, notification, Spin, Pagination } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import UserModal from "./user.modal";
import { fetchUsers, deleteUser } from "@/app/actions/user.action";

const UserTable = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const loadUsers = async (page: number = 1, pageSize: number = 10) => {
        setLoading(true);
        try {
            const response = await fetchUsers(page, pageSize);
            if (response.statusCode === 200 && response.data) {
                setUsers(response.data.result);
                setPagination({
                    current: response.data.meta.current,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total,
                });
            } else {
                notification.error({
                    message: "Failed to load users",
                    description: response.message,
                });
            }
        } catch (error) {
            notification.error({
                message: "Error loading users",
                description: (error as any)?.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(1, 10);
    }, []);

    const handleCreateUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user: IUser) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDeleteUser = (user: IUser) => {
        Modal.confirm({
            title: "Delete User",
            content: `Are you sure you want to delete user "${user.name}"?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                setLoading(true);
                try {
                    const response = await deleteUser(user._id!);
                    if (response.statusCode === 200) {
                        notification.success({
                            message: "User deleted successfully",
                        });
                        loadUsers(pagination.current, pagination.pageSize);
                    } else {
                        notification.error({
                            message: "Failed to delete user",
                            description: response.message,
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Error deleting user",
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
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            width: 80,
            render: (age: number) => age || "-",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 200,
            render: (address: string) => address || "-",
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_: any, record: IUser) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUser(record)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button type="primary" onClick={handleCreateUser}>
                    Create User
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table
                    bordered
                    dataSource={users}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 900 }}
                />
            </Spin>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                        loadUsers(page, pageSize);
                    }}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50"]}
                />
            </div>

            <UserModal
                open={modalOpen}
                loading={modalLoading}
                user={selectedUser}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={() => {
                    loadUsers(pagination.current, pagination.pageSize);
                }}
            />
        </>
    );
};

export default UserTable;
