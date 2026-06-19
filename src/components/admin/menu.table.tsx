'use client'

import { Button, Form, Input, Modal, notification, Spin, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createMenu, updateMenu, deleteMenu } from "@/app/actions/menu.action";

interface IMenuTableProps {
    restaurantId: string;
    menus: IMenu[];
    loading: boolean;
    onRefresh: () => void;
    onSelectMenu: (menu: IMenu | null) => void;
    selectedMenuId?: string;
}

const MenuTable = ({
    restaurantId,
    menus,
    loading,
    onRefresh,
    onSelectMenu,
    selectedMenuId,
}: IMenuTableProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const isEditMode = !!selectedMenu?._id;

    const handleCreate = () => {
        setSelectedMenu(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (menu: IMenu) => {
        setSelectedMenu(menu);
        form.setFieldsValue({ title: menu.title, description: menu.description });
        setModalOpen(true);
    };

    const handleDelete = (menu: IMenu) => {
        Modal.confirm({
            title: 'Delete Menu',
            content: `Are you sure you want to delete menu "${menu.title}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await deleteMenu(menu._id!);
                    if (response.statusCode === 200) {
                        notification.success({ message: 'Menu deleted successfully' });
                        // If we deleted the selected menu, reset selection
                        if (selectedMenuId === menu._id) onSelectMenu(null);
                        onRefresh();
                    } else {
                        notification.error({ message: 'Failed to delete menu', description: response.message });
                    }
                } catch {
                    notification.error({ message: 'Error deleting menu' });
                }
            },
        });
    };

    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            let response;
            if (isEditMode) {
                response = await updateMenu(selectedMenu!._id!, {
                    title: values.title,
                    description: values.description,
                });
            } else {
                response = await createMenu({
                    restaurant: restaurantId,
                    title: values.title,
                    description: values.description,
                });
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                notification.success({
                    message: isEditMode ? 'Menu updated successfully' : 'Menu created successfully',
                });
                setModalOpen(false);
                form.resetFields();
                onRefresh();
            } else {
                notification.error({ message: response.message || 'Operation failed' });
            }
        } catch {
            notification.error({ message: 'An error occurred' });
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: IMenu) => (
                <a
                    style={{
                        fontWeight: selectedMenuId === record._id ? 700 : 400,
                        color: selectedMenuId === record._id ? '#1677ff' : undefined,
                    }}
                    onClick={() => onSelectMenu(record)}
                >
                    {title}
                </a>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (desc?: string) => desc || '—',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: any, record: IMenu) => (
                <div style={{ display: 'flex', gap: 6 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>Menus</span>
                <Button type="primary" size="small" onClick={handleCreate}>
                    + Add Menu
                </Button>
            </div>

            <Spin spinning={loading}>
                <Table
                    dataSource={menus}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    pagination={false}
                    rowClassName={(record) =>
                        selectedMenuId === record._id ? 'ant-table-row-selected' : ''
                    }
                    locale={{ emptyText: 'No menus. Select a restaurant first.' }}
                />
            </Spin>

            <Modal
                title={isEditMode ? 'Edit Menu' : 'Create Menu'}
                open={modalOpen}
                onCancel={() => { setModalOpen(false); form.resetFields(); }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        label="Menu Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter menu title' }]}
                    >
                        <Input placeholder="e.g. Lunch Menu, Dinner Specials" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} placeholder="Optional description" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <Button onClick={() => { setModalOpen(false); form.resetFields(); }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {isEditMode ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default MenuTable;
