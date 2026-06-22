'use client'

import { Card, Row, Col, Statistic, Table, Progress } from 'antd';
import { TeamOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons';

interface Customer {
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}

interface Engagement {
  totalCustomers: number;
  returningCustomers: number;
  repeatCustomerRate: number;
  topCustomers: Customer[];
}

interface Props {
  engagement: Engagement;
}

const CustomerEngagement = ({ engagement }: Props) => {
  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Customer) => (
        <div>
          <div>{text}</div>
          <small style={{ color: '#999' }}>{record.email}</small>
        </div>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 100,
      render: (text: number) => `${text.toLocaleString('vi-VN')}đ`,
      align: 'right' as const,
    },
  ];

  return (
    <div>
      <Card title="Customer Engagement" bordered={false} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Total Customers"
              value={engagement.totalCustomers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Returning Rate"
              value={engagement.repeatCustomerRate}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <small>Returning Customers: {engagement.returningCustomers}</small>
          </div>
          <Progress
            percent={(engagement.returningCustomers / engagement.totalCustomers) * 100}
            status="active"
          />
        </div>
      </Card>

      <Card title="Top Customers" bordered={false}>
        <Table
          dataSource={engagement.topCustomers}
          columns={columns}
          pagination={false}
          rowKey="email"
          size="small"
        />
      </Card>
    </div>
  );
};

export default CustomerEngagement;
