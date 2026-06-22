'use client'

import { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Button, Space, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { API_URL } from '@/utils/config';
import StatisticCards from './StatisticCards';
import RevenueChart from './RevenueChart';
import TopSellingProducts from './TopSellingProducts';
import CustomerEngagement from './CustomerEngagement';
import RecentOrders from './RecentOrders';

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    activeOrders: number;
    averageOrderValue: number;
  };
  dailyRevenue: Array<{ date: string; revenue: number; count: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; count: number }>;
  topSellingProducts: Array<{ title: string; count: number; revenue: number; image: string }>;
  customerEngagement: {
    totalCustomers: number;
    returningCustomers: number;
    repeatCustomerRate: number;
    topCustomers: Array<{ name: string; email: string; orderCount: number; totalSpent: number }>;
  };
  recentOrders: Array<{
    _id: string;
    customerName: string;
    restaurantName: string;
    totalPrice: number;
    status: string;
    orderTime: string;
  }>;
}

const DashboardAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/orders/analytics/summary`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ padding: '20px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <h2>Dashboard Analytics & Reporting</h2>
        <Tooltip title="Refresh data">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAnalytics}
            loading={loading}
          >
            Refresh
          </Button>
        </Tooltip>
      </Row>

      {error && <Alert message="Error" description={error} type="error" showIcon closable style={{ marginBottom: 20 }} />}

      {data && (
        <>
          <StatisticCards summary={data.summary} />

          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} lg={16}>
              <RevenueChart daily={data.dailyRevenue} monthly={data.monthlyRevenue} />
            </Col>
            <Col xs={24} lg={8}>
              <CustomerEngagement engagement={data.customerEngagement} />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            <Col xs={24} lg={12}>
              <TopSellingProducts products={data.topSellingProducts} />
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Recent Orders" bordered={false}>
                <RecentOrders orders={data.recentOrders} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardAnalytics;
