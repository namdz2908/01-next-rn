'use client'

import { Card, Table, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Product {
  title: string;
  count: number;
  revenue: number;
  image: string;
}

interface Props {
  products: Product[];
}

const TopSellingProducts = ({ products }: Props) => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Product, index: number) => (
        <div>
          <span>{text}</span>
          <Tag color={colors[index % colors.length]} style={{ marginLeft: 8 }}>
            #{index + 1}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      sorter: (a: Product, b: Product) => a.count - b.count,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      render: (text: number) => `${text.toLocaleString('vi-VN')}đ`,
      sorter: (a: Product, b: Product) => a.revenue - b.revenue,
    },
  ];

  return (
    <Card title="Top Selling Products" bordered={false}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={products}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`} />
          <Bar dataKey="count" name="Orders" fill="#1890ff">
            {products.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Table
        dataSource={products}
        columns={columns}
        pagination={false}
        rowKey="title"
        size="small"
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default TopSellingProducts;
