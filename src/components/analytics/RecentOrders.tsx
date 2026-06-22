'use client'

import { Table, Tag, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface Order {
  _id: string;
  customerName: string;
  restaurantName: string;
  totalPrice: number;
  status: string;
  orderTime: string;
}

interface Props {
  orders: Order[];
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; icon: React.ReactNode }> = {
    delivered: { color: 'green', icon: <CheckCircleOutlined /> },
    preparing: { color: 'processing', icon: <ClockCircleOutlined /> },
    confirmed: { color: 'blue', icon: <ClockCircleOutlined /> },
    pending: { color: 'warning', icon: <ExclamationCircleOutlined /> },
    cancelled: { color: 'error', icon: <ExclamationCircleOutlined /> },
  };
  return configs[status] || { color: 'default', icon: null };
};

const RecentOrders = ({ orders }: Props) => {
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: 'Restaurant',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
      width: 140,
    },
    {
      title: 'Amount',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (text: number) => `${text.toLocaleString('vi-VN')}đ`,
      align: 'right' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const { color, icon } = getStatusConfig(status);
        return (
          <Tag color={color} icon={icon}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 140,
      render: (time: string) => new Date(time).toLocaleString('vi-VN'),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      pagination={false}
      rowKey="_id"
      size="small"
      scroll={{ x: 600 }}
    />
  );
};

export default RecentOrders;
