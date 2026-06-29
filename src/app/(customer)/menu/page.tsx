'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Row, Col, Card, Button, Input, Space, Pagination, Tag, Drawer, InputNumber, message, Spin, Empty, Select, Radio } from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { fetchRestaurants } from '@/app/actions/restaurant.action'
import { fetchMenuItems } from '@/app/actions/menu.action'

interface MenuItem {
  _id: string
  name: string
  description: string
  basePrice: number
  category: string
  enabled: boolean
}

interface CartItem {
  item: MenuItem
  quantity: number
}

const MenuPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurant')

  const [restaurant, setRestaurant] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [current, setCurrent] = useState(1)
  const [pageSize] = useState(8)
  const [total, setTotal] = useState(0)
  const [orderType, setOrderType] = useState('delivery')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantAndMenu()
    } else {
      router.push('/customer/order')
    }
  }, [restaurantId, current])

  const loadRestaurantAndMenu = async () => {
    try {
      setLoading(true)

      // Fetch restaurant
      const restaurantRes = await fetchRestaurants(1, 100)
      const foundRestaurant = restaurantRes?.data?.results?.find(
        (r: any) => r._id === restaurantId
      )
      if (foundRestaurant) {
        setRestaurant(foundRestaurant)
      }

      // Fetch menu items
      const menuRes = await fetchMenuItems(current, pageSize, restaurantId)
      if (menuRes?.statusCode === 200 && menuRes?.data?.results) {
        setMenuItems(menuRes.data.results)
        setTotal(menuRes.data?.meta?.total || 0)

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(menuRes.data.results.map((item: any) => item.category).filter(Boolean))
        )
        setCategories(uniqueCategories as string[])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      message.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item: any) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory && item.enabled
  })

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((ci) => ci.item._id === item._id)
      if (existingItem) {
        return prevCart.map((ci) =>
          ci.item._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [...prevCart, { item, quantity: 1 }]
    })
    message.success(`${item.name} added to cart!`)
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((ci) => ci.item._id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(
        cart.map((ci) =>
          ci.item._id === itemId ? { ...ci, quantity } : ci
        )
      )
    }
  }

  const totalPrice = cart.reduce((sum, ci) => sum + ci.item.basePrice * ci.quantity, 0)
  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('Your cart is empty')
      return
    }
    router.push(
      `/customer/checkout?restaurant=${restaurantId}&type=${orderType}&cart=${encodeURIComponent(
        JSON.stringify(cart)
      )}`
    )
  }

  if (!restaurantId) return null

  return (
    <div>
      {/* Header with Back Button and Cart */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/customer/order')}
              >
                Back to Restaurants
              </Button>
            </Space>
          </Col>
          <Col>
            {loading ? (
              <Spin />
            ) : (
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: '0 0 8px 0' }}>{restaurant?.name || 'Menu'}</h2>
                <p style={{ color: '#666', margin: 0 }}>📍 {restaurant?.address}</p>
              </div>
            )}
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => setCartDrawerOpen(true)}
              style={{
                backgroundColor: '#667eea',
                position: 'relative',
              }}
            >
              Cart ({totalItems})
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Order Type Selection */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <h3>How would you like to order?</h3>
          <Radio.Group value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <Space direction="vertical">
              <Radio value="delivery">
                <span style={{ fontSize: '14px' }}>🚚 Delivery to Home</span>
              </Radio>
              <Radio value="dine-in">
                <span style={{ fontSize: '14px' }}>🍽️ Dine In at Restaurant</span>
              </Radio>
            </Space>
          </Radio.Group>
        </Space>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              placeholder="Search menu items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              <Select.Option value="all">All Categories</Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Menu Items Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Empty description="No items found" style={{ padding: '60px 0' }} />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            {filteredItems.map((item) => (
              <Col xs={24} sm={12} md={6} key={item._id}>
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
                >
                  <div
                    style={{
                      height: '120px',
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      marginBottom: '12px',
                    }}
                  >
                    🍜
                  </div>
                  <h4 style={{ marginBottom: '4px', fontSize: '14px', fontWeight: '600' }}>
                    {item.name}
                  </h4>
                  <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px', flex: 1 }}>
                    {item.description}
                  </p>
                  <Tag color="blue" style={{ alignSelf: 'fit-content', marginBottom: '12px' }}>
                    {item.category}
                  </Tag>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#667eea' }}>
                      ${item.basePrice.toFixed(2)}
                    </span>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => addToCart(item)}
                      style={{ backgroundColor: '#667eea' }}
                    >
                      Add
                    </Button>
                  </div>
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

      {/* Cart Drawer */}
      <Drawer
        title={`Shopping Cart (${totalItems} items)`}
        placement="right"
        onClose={() => setCartDrawerOpen(false)}
        open={cartDrawerOpen}
        width={400}
      >
        {cart.length === 0 ? (
          <Empty description="Your cart is empty" />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            {cart.map((cartItem) => (
              <Card key={cartItem.item._id} size="small">
                <Row justify="space-between" align="middle">
                  <Col>
                    <h4 style={{ margin: '0 0 4px 0' }}>{cartItem.item.name}</h4>
                    <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                      ${cartItem.item.basePrice.toFixed(2)} each
                    </p>
                  </Col>
                  <Col>
                    <InputNumber
                      min={1}
                      value={cartItem.quantity}
                      onChange={(val) => updateQuantity(cartItem.item._id, val!)}
                      style={{ width: '60px' }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromCart(cartItem.item._id)}
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: '8px' }} justify="end">
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                    ${(cartItem.item.basePrice * cartItem.quantity).toFixed(2)}
                  </span>
                </Row>
              </Card>
            ))}

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <Row justify="space-between" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#667eea' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </Row>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                style={{ backgroundColor: '#667eea' }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  )
}

export default MenuPage
