'use client'

import { Modal, Form, Input, InputNumber, Select, Switch, Button, notification } from "antd";
import { useEffect } from "react";
import { createMenuItem, updateMenuItem } from "@/app/actions/menu-item.action";

interface IMenuItemModalProps {
    open: boolean;
    menuId: string;
    categories: IMenuCategory[];
    menuItem?: IMenuItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

const MenuItemModal = ({
    open,
    menuId,
    categories,
    menuItem,
    onClose,
    onSuccess,
}: IMenuItemModalProps) => {
    const [form] = Form.useForm();
    const isEditMode = !!menuItem?._id;

    useEffect(() => {
        if (open && menuItem) {
            const categoryId =
                typeof menuItem.category === 'object'
                    ? menuItem.category._id
                    : menuItem.category;
            form.setFieldsValue({
                title: menuItem.title,
                description: menuItem.description,
                basePrice: menuItem.basePrice,
                category: categoryId,
                enabled: menuItem.enabled,
            });
        } else if (open) {
            form.resetFields();
            form.setFieldValue('enabled', true);
        }
    }, [open, menuItem, form]);

    const onFinish = async (values: any) => {
        try {
            let response;
            if (isEditMode) {
                response = await updateMenuItem(menuItem!._id!, {
                    title: values.title,
                    description: values.description,
                    basePrice: values.basePrice,
                    category: values.category,
                    enabled: values.enabled,
                });
            } else {
                response = await createMenuItem({
                    menu: menuId,
                    title: values.title,
                    description: values.description,
                    basePrice: values.basePrice,
                    category: values.category,
                    enabled: values.enabled ?? true,
                });
            }

            const expectedStatus = isEditMode ? 200 : 201;
            if (response.statusCode === expectedStatus) {
                notification.success({
                    message: isEditMode
                        ? 'Menu item updated successfully'
                        : 'Menu item created successfully',
                });
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                notification.error({
                    message: response.message || 'Operation failed',
                    description: typeof response.error === 'string' ? response.error : '',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: (error as any)?.message || 'Unknown error occurred',
            });
        }
    };

    const categoryOptions = categories
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(cat => ({ label: cat.name, value: cat._id }));

    return (
        <Modal
            title={isEditMode ? 'Edit Menu Item' : 'Create Menu Item'}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={520}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 16 }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter item title' }]}
                >
                    <Input placeholder="e.g. Phở Bò Tái" />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={2} placeholder="Optional description" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select
                        options={categoryOptions}
                        placeholder="Select category"
                        notFoundContent="No categories. Please create categories first."
                    />
                </Form.Item>

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
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => (Number(value?.replace(/,/g, '') ?? 0)) as any}
                        placeholder="e.g. 85000"
                    />
                </Form.Item>

                <Form.Item label="Enabled" name="enabled" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MenuItemModal;
