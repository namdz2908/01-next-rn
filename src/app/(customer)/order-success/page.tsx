'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card, Row, Col, Button, Space, Statistic, Timeline, Empty } from 'antd'
import { CheckCircleOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const OrderSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div style={{ padding: '40px 20px' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card
            style={{
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              borderRadius: '12px',
            }}
            bordered={false}
          >
            <div style={{ fontSize: '60px', marginBottom: '16px', color: '#52c41a' }}>
              ✅
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              Order Placed Successfully!
            </h1>

            <p style={{ color: '#666', marginBottom: '24px', fontSize: '16px' }}>
              Your order has been received and is being prepared
            </p>

            {orderId && (
              <Card
                type="inner"
                style={{ backgroundColor: '#f0f5ff', marginBottom: '24px', border: 'none' }}
              >
                <Statistic
                  title="Order ID"
                  value={orderId}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#667eea', fontSize: '16px' }}
                />
              </Card>
            )}

            <Card
              type="inner"
              title="What Happens Next?"
              style={{ marginBottom: '24px', textAlign: 'left' }}
            >
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: <p>✅ Your order is confirmed</p>,
                  },
                  {
                    color: 'blue',
                    children: <p>🔄 Restaurant is preparing your food</p>,
                  },
                  {
                    color: 'orange',
                    children: <p>📦 Order will be ready in 30-45 minutes</p>,
                  },
                  {
                    color: 'green',
                    children: <p>🚚 Driver will deliver to your address</p>,
                  },
                ]}
              />
            </Card>

            <Space style={{ width: '100%', gap: '12px' }} direction="vertical">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                block
                onClick={() => router.push('/')}
                style={{ backgroundColor: '#667eea', height: '40px' }}
              >
                Back to Home
              </Button>
              <Button
                size="large"
                block
                onClick={() => router.push('/customer/order')}
                style={{ height: '40px' }}
              >
                Order More Food
              </Button>
            </Space>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                💬 Need help? Contact us at support@foodhub.com or call +1-800-FOOD-HUB
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
      <OrderSuccessPage />
    </Suspense>
  )
}
