'use client'

import { useState } from 'react';
import { Card, Segmented, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date?: string;
  month?: string;
  revenue: number;
  count: number;
}

interface Props {
  daily: RevenueData[];
  monthly: RevenueData[];
}

const RevenueChart = ({ daily, monthly }: Props) => {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const data = view === 'daily' ? daily : monthly;
  const xKey = view === 'daily' ? 'date' : 'month';

  return (
    <Card title="Revenue Trends" bordered={false}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Segmented
            value={view}
            onChange={(val) => setView(val as 'daily' | 'monthly')}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Monthly', value: 'monthly' },
            ]}
          />
        </Col>
      </Row>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')}đ`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ fill: '#1890ff' }}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#52c41a"
            strokeWidth={2}
            dot={{ fill: '#52c41a' }}
            yAxisId="right"
            name="Orders"
          />
          <YAxis yAxisId="right" orientation="right" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
