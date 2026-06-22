'use client'

import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, TeamOutlined, LineChartOutlined } from '@ant-design/icons';

interface Summary {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  averageOrderValue: number;
}

interface Props {
  summary: Summary;
}

const StatisticCards = ({ summary }: Props) => {
  const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Revenue"
            value={summary.totalRevenue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#1890ff' }}
            formatter={(val) => formatCurrency(val as number)}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total Orders"
            value={summary.totalOrders}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Active Orders"
            value={summary.activeOrders}
            prefix={<LineChartOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Avg Order Value"
            value={summary.averageOrderValue}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#722ed1' }}
            formatter={(val) => formatCurrency(val as number)}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCards;
