'use client'

import { Layout } from 'antd'
import { useRouter } from 'next/navigation'

const { Header, Content, Footer } = Layout

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          🍽️ FoodHub
        </div>
      </Header>
      <Content style={{ padding: '24px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        FoodHub ©2024 - Order your favorite food
      </Footer>
    </Layout>
  )
}
