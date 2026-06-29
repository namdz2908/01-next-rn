'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Row, Col, Card, Button, Empty, Spin, Input, Space, Pagination, Tag } from 'antd'
import { SearchOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { fetchRestaurants } from '@/app/actions/restaurant.action'

const OrderPage = () => {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(12)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadRestaurants()
  }, [current])

  const loadRestaurants = async () => {
    try {
      setLoading(true)
      const res = await fetchRestaurants(current, pageSize)
      if (res?.statusCode === 200 && res?.data?.results) {
        setRestaurants(res.data.results)
        setTotal(res.data?.meta?.total || 0)
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRestaurants = restaurants.filter((r: any) =>
    r.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    r.address?.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleSelectRestaurant = (restaurantId: string) => {
    router.push(`/customer/menu?restaurant=${restaurantId}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          border: 'none',
          color: 'white',
          marginBottom: '32px',
          padding: '40px',
        }}
        bordered={false}
      >
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 12px 0' }}>
          🍕 Order Delicious Food
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
          Choose your favorite restaurant and enjoy great food delivered to your door or eat here
        </p>
      </Card>

      {/* Search Bar */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Input
          placeholder="Search restaurants by name or address..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="large"
          style={{ borderRadius: '8px' }}
        />
      </Card>

      {/* Restaurants Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <Empty
          description={searchText ? 'No restaurants found' : 'No restaurants available'}
          style={{ padding: '60px 0' }}
        />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            {filteredRestaurants.map((restaurant: any) => (
              <Col xs={24} sm={12} md={8} key={restaurant._id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  bodyStyle={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}
                  onClick={() => handleSelectRestaurant(restaurant._id)}
                >
                  <div
                    style={{
                      height: '150px',
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      marginBottom: '16px',
                    }}
                  >
                    🍽️
                  </div>
                  <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
                    {restaurant.name || 'Unknown Restaurant'}
                  </h3>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
                    📍 {restaurant.address || 'No address'}
                  </p>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '12px' }}>
                    📞 {restaurant.phone || 'No phone'}
                  </p>
                  <Tag
                    color={restaurant.enabled ? 'green' : 'red'}
                    style={{ alignSelf: 'fit-content', marginBottom: '12px' }}
                  >
                    {restaurant.enabled ? 'Open' : 'Closed'}
                  </Tag>
                  <Button
                    type="primary"
                    style={{ marginTop: 'auto', backgroundColor: '#667eea' }}
                    icon={<ArrowRightOutlined />}
                  >
                    Order Now
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={(page) => setCurrent(page)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default OrderPage
