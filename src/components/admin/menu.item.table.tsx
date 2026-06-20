'use client'

import {
    Button,
    Checkbox,
    Form,
    InputNumber,
    Modal,
    notification,
    Select,
    Spin,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { TableRowSelection } from "antd/es/table/interface";
import MenuCategoryFilter from "./menu.category.filter";
import MenuItemModal from "./menu.item.modal";
import { deleteMenuItem, bulkUpdateMenuItems } from "@/app/actions/menu-item.action";

interface IMenuItemTableProps {
    menuId: string;
    menuItems: IMenuItem[];
    categories: IMenuCategory[];
    loading: boolean;
    onRefresh: () => void;
}

// --- Bulk Update Form Types ---
type BulkField = 'enabled' | 'basePrice' | 'category' | 'description';

const BULK_FIELDS: { key: BulkField; label: string }[] = [
    { key: 'enabled', label: 'Status (Enable/Disable)' },
    { key: 'basePrice', label: 'Base Price' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
];

const MenuItemTable = ({
    menuId,
    menuItems,
    categories,
    loading,
    onRefresh,
}: IMenuItemTableProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [filteredCategoryId, setFilteredCategoryId] = useState<string | null>(null);
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);

    // Bulk update modal state
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [bulkSelectedFields, setBulkSelectedFields] = useState<BulkField[]>([]);
    const [bulkSubmitting, setBulkSubmitting] = useState(false);
    const [bulkForm] = Form.useForm();

    // Reset selection when menu changes
    useEffect(() => {
        setSelectedRowKeys([]);
        setFilteredCategoryId(null);
    }, [menuId]);

    // Filter items by selected category
    const displayedItems = filteredCategoryId
        ? menuItems.filter(item => {
            const catId = typeof item.category === 'object' ? item.category._id : item.category;
            return catId === filteredCategoryId;
        })
        : menuItems;

    const getCategoryName = (category: string | IMenuCategory | null): string => {
        if (!category) return '—';
        if (typeof category === 'object') return category.name;
        const found = categories.find(c => c._id === category);
        return found?.name ?? category;
    };

    // --- Single item delete ---
    const handleDelete = (item: IMenuItem) => {
        Modal.confirm({
            title: 'Delete Menu Item',
            content: `Are you sure you want to delete "${item.title}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const res = await deleteMenuItem(item._id!);
                    if (res.statusCode === 200) {
                        notification.success({ message: 'Menu item deleted' });
                        setSelectedRowKeys(prev => prev.filter(k => k !== item._id));
                        onRefresh();
                    } else {
                        notification.error({ message: 'Failed to delete', description: res.message });
                    }
                } catch {
                    notification.error({ message: 'Error deleting menu item' });
                }
            },
        });
    };

    // --- Bulk update modal submit ---
    const handleBulkSubmit = async (values: any) => {
        setBulkSubmitting(true);
        try {
            const updateData: { enabled?: boolean; basePrice?: number; category?: string; description?: string } = {};
            if (bulkSelectedFields.includes('enabled')) updateData.enabled = values.enabled;
            if (bulkSelectedFields.includes('basePrice')) updateData.basePrice = values.basePrice;
            if (bulkSelectedFields.includes('category')) updateData.category = values.category;
            if (bulkSelectedFields.includes('description')) updateData.description = values.description;

            const res = await bulkUpdateMenuItems(selectedRowKeys, updateData);
            if (res.statusCode === 200) {
                notification.success({ message: `${selectedRowKeys.length} item(s) updated successfully` });
                setBulkModalOpen(false);
                setBulkSelectedFields([]);
                setSelectedRowKeys([]);
                bulkForm.resetFields();
                onRefresh();
            } else {
                notification.error({ message: res.message || 'Bulk update failed' });
            }
        } catch {
            notification.error({ message: 'Error during bulk update' });
        } finally {
            setBulkSubmitting(false);
        }
    };

    const rowSelection: TableRowSelection<IMenuItem> = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as string[]),
    };

    const categoryOptions = categories
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(c => ({ label: c.name, value: c._id }));

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title: string) => <span style={{ fontWeight: 500 }}>{title}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: any) => (
                <Tag color="geekblue">{getCategoryName(cat)}</Tag>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'basePrice',
            key: 'basePrice',
            render: (price: number) =>
                price != null
                    ? `${price.toLocaleString('vi-VN')} ₫`
                    : '—',
        },
        {
            title: 'Status',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean) =>
                enabled ? (
                    <Tag color="success">Active</Tag>
                ) : (
                    <Tag color="error">Inactive</Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_: any, record: IMenuItem) => (
                <div style={{ display: 'flex', gap: 6 }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedItem(record);
                            setItemModalOpen(true);
                        }}
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
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>Menu Items</span>
                    <MenuCategoryFilter
                        categories={categories}
                        selectedCategoryId={filteredCategoryId}
                        onChange={setFilteredCategoryId}
                    />
                </div>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => { setSelectedItem(null); setItemModalOpen(true); }}
                    disabled={!menuId}
                >
                    + Add Item
                </Button>
            </div>

            {/* Bulk actions bar */}
            {selectedRowKeys.length > 0 && (
                <div style={{
                    background: '#e6f4ff',
                    border: '1px solid #91caff',
                    borderRadius: 8,
                    padding: '8px 16px',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                }}>
                    <span style={{ fontWeight: 500, color: '#1677ff' }}>
                        {selectedRowKeys.length} item(s) selected
                    </span>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setBulkSelectedFields([]);
                            bulkForm.resetFields();
                            setBulkModalOpen(true);
                        }}
                    >
                        Bulk Update
                    </Button>
                    <Button
                        size="small"
                        onClick={() => setSelectedRowKeys([])}
                    >
                        Clear Selection
                    </Button>
                </div>
            )}

            {/* Main table */}
            <Spin spinning={loading}>
                <Table
                    dataSource={displayedItems}
                    columns={columns}
                    rowKey="_id"
                    rowSelection={rowSelection}
                    size="small"
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    locale={{ emptyText: 'No items. Select a menu first.' }}
                />
            </Spin>

            {/* Single item create/edit modal */}
            <MenuItemModal
                open={itemModalOpen}
                menuId={menuId}
                categories={categories}
                menuItem={selectedItem}
                onClose={() => { setItemModalOpen(false); setSelectedItem(null); }}
                onSuccess={onRefresh}
            />

            {/* Bulk update modal */}
            <Modal
                title={`Bulk Update (${selectedRowKeys.length} items)`}
                open={bulkModalOpen}
                onCancel={() => { setBulkModalOpen(false); bulkForm.resetFields(); setBulkSelectedFields([]); }}
                footer={null}
                destroyOnClose
                width={500}
            >
                {/* Step 1: Select fields */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>Step 1: Select fields to update</div>
                    <Checkbox.Group
                        value={bulkSelectedFields}
                        onChange={(vals) => setBulkSelectedFields(vals as BulkField[])}
                        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                        {BULK_FIELDS.map(f => (
                            <Checkbox key={f.key} value={f.key}>{f.label}</Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>

                {/* Step 2: Enter values */}
                {bulkSelectedFields.length > 0 && (
                    <>
                        <div style={{ fontWeight: 500, marginBottom: 8 }}>Step 2: Enter new values</div>
                        <Form form={bulkForm} layout="vertical" onFinish={handleBulkSubmit}>
                            {bulkSelectedFields.includes('enabled') && (
                                <Form.Item
                                    label="Status"
                                    name="enabled"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select
                                        options={[
                                            { label: 'Active (Enabled)', value: true },
                                            { label: 'Inactive (Disabled)', value: false },
                                        ]}
                                        placeholder="Select status"
                                    />
                                </Form.Item>
                            )}

                            {bulkSelectedFields.includes('basePrice') && (
                                <Form.Item
                                    label="Base Price (VND)"
                                    name="basePrice"
                                    rules={[
                                        { required: true, message: 'Please enter price' },
                                        { type: 'number', min: 0, message: 'Price must be non-negative' },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        step={1000}
                                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(v) => (Number(v?.replace(/,/g, '') ?? 0)) as any}
                                        placeholder="e.g. 85000"
                                    />
                                </Form.Item>
                            )}

                            {bulkSelectedFields.includes('category') && (
                                <Form.Item
                                    label="Category"
                                    name="category"
                                    rules={[{ required: true, message: 'Please select a category' }]}
                                >
                                    <Select options={categoryOptions} placeholder="Select category" />
                                </Form.Item>
                            )}

                            {bulkSelectedFields.includes('description') && (
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[{ required: true, message: 'Please enter description' }]}
                                >
                                    <Form.Item name="description" noStyle>
                                        <input
                                            className="ant-input"
                                            placeholder="New description for selected items"
                                            style={{ width: '100%', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 6 }}
                                            onChange={(e) => bulkForm.setFieldValue('description', e.target.value)}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            )}

                            <Form.Item style={{ marginBottom: 0 }}>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <Button onClick={() => { setBulkModalOpen(false); bulkForm.resetFields(); setBulkSelectedFields([]); }}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={bulkSubmitting}>
                                        Apply to {selectedRowKeys.length} item(s)
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {bulkSelectedFields.length === 0 && (
                    <div style={{ color: '#888', marginTop: 8 }}>Please select at least one field above to continue.</div>
                )}
            </Modal>
        </>
    );
};

export default MenuItemTable;
