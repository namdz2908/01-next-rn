'use client'

import { Modal, Form, Input, InputNumber, Button, notification } from "antd"
import { useEffect } from "react";
import { createUser, updateUser } from "@/app/actions/user.action";

interface IUserModalProps {
    open: boolean;
    loading: boolean;
    user?: IUser | null;
    onClose: () => void;
    onSuccess: () => void;
}

const UserModal = ({ open, loading, user, onClose, onSuccess }: IUserModalProps) => {
    const [form] = Form.useForm();
    const isEditMode = !!user?._id;

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                email: user.email,
                name: user.name,
                age: user.age,
                address: user.address,
            });
        } else if (open) {
            form.resetFields();
        }
    }, [open, user, form]);

    const onFinish = async (values: any) => {
        try {
            let response;

            if (isEditMode) {
                const { email, name, age, address } = values;
                response = await updateUser(user!._id!, {
                    email,
                    name,
                    age,
                    address,
                });
            } else {
                const { email, name, password, age, address } = values;
                response = await createUser({
                    email,
                    name,
                    password,
                    age,
                    address,
                });
            }

            if (response.statusCode === (isEditMode ? 200 : 201)) {
                notification.success({
                    message: isEditMode ? "User updated successfully" : "User created successfully",
                });
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                notification.error({
                    message: response.message || "Operation failed",
                    description: typeof response.error === "string"
                        ? response.error
                        : Array.isArray(response.error)
                            ? response.error.join(", ")
                            : "",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: (error as any)?.message || "Unknown error occurred",
            });
        }
    };

    return (
        <Modal
            title={isEditMode ? "Edit User" : "Create New User"}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input type="email" placeholder="user@example.com" />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter name" }]}
                >
                    <Input placeholder="Full name" />
                </Form.Item>

                {!isEditMode && (
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: "Please enter password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Age"
                    name="age"
                    rules={[
                        { type: "number", message: "Please enter a valid number" },
                    ]}
                >
                    <InputNumber placeholder="Age" min={0} max={150} />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                >
                    <Input placeholder="Address" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {isEditMode ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModal;
