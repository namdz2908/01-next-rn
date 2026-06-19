'use client'

import { Modal, Form, Input, Button, notification } from "antd";
import { useEffect } from "react";
import { createRestaurant, updateRestaurant } from "@/app/actions/restaurant.action";

interface IRestaurantFormProps {
    open: boolean;
    restaurant?: IRestaurant | null;
    onClose: () => void;
    onSuccess: () => void;
}

const DAYS_OF_WEEK = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' },
];

const DEFAULT_HOURS: Record<string, string> = {
    mon: '08:00-22:00',
    tue: '08:00-22:00',
    wed: '08:00-22:00',
    thu: '08:00-22:00',
    fri: '08:00-22:00',
    sat: '08:00-22:00',
    sun: '08:00-22:00',
};

const RestaurantForm = ({ open, restaurant, onClose, onSuccess }: IRestaurantFormProps) => {
    const [form] = Form.useForm();
    const isEditMode = !!restaurant?._id;

    useEffect(() => {
        if (open && restaurant) {
            const parsedHours: Record<string, string> = DEFAULT_HOURS;
            if (restaurant.hours) {
                try {
                    const h = JSON.parse(restaurant.hours);
                    Object.assign(parsedHours, h);
                } catch {
                    // fallback to defaults
                }
            }
            form.setFieldsValue({
                name: restaurant.name,
                phone: restaurant.phone,
                address: restaurant.address,
                email: restaurant.email,
                ...Object.fromEntries(
                    DAYS_OF_WEEK.map(d => [`hours_${d.key}`, parsedHours[d.key] ?? ''])
                ),
            });
        } else if (open) {
            form.resetFields();
            // Set default hours
            DAYS_OF_WEEK.forEach(d => {
                form.setFieldValue(`hours_${d.key}`, DEFAULT_HOURS[d.key]);
            });
        }
    }, [open, restaurant, form]);

    const onFinish = async (values: any) => {
        const hoursObj: Record<string, string> = {};
        DAYS_OF_WEEK.forEach(d => {
            if (values[`hours_${d.key}`]) {
                hoursObj[d.key] = values[`hours_${d.key}`];
            }
        });

        const payload: ICreateRestaurantRequest = {
            name: values.name,
            phone: values.phone,
            address: values.address,
            email: values.email,
            hours: JSON.stringify(hoursObj),
        };

        try {
            let response;
            if (isEditMode) {
                response = await updateRestaurant(restaurant!._id!, payload);
            } else {
                response = await createRestaurant(payload);
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                notification.success({
                    message: isEditMode
                        ? 'Restaurant updated successfully'
                        : 'Restaurant created successfully',
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

    return (
        <Modal
            title={isEditMode ? 'Edit Restaurant' : 'Create Restaurant'}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={640}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 20 }}
            >
                <Form.Item
                    label="Restaurant Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter restaurant name' }]}
                >
                    <Input placeholder="e.g. Phở Hà Nội" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Invalid email format' },
                    ]}
                >
                    <Input placeholder="contact@restaurant.com" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                    <Input placeholder="0912 345 678" />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter address' }]}
                >
                    <Input placeholder="123 Nguyễn Trãi, Hà Nội" />
                </Form.Item>

                <div style={{ marginBottom: 8, fontWeight: 500 }}>Operating Hours</div>
                <div
                    style={{
                        background: '#fafafa',
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        padding: '12px 16px',
                        marginBottom: 20,
                    }}
                >
                    {DAYS_OF_WEEK.map(day => (
                        <Form.Item
                            key={day.key}
                            label={day.label}
                            name={`hours_${day.key}`}
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                placeholder="08:00-22:00"
                                style={{ maxWidth: 200 }}
                            />
                        </Form.Item>
                    ))}
                </div>

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

export default RestaurantForm;
