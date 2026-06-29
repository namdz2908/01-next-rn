'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button, Badge, Drawer, List, Empty, Space, Tag, Card } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'

interface Notification {
  id: string
  orderId: string
  customerName: string
  restaurantName: string
  items: string
  totalPrice: number
  orderType: 'delivery' | 'dine-in'
  timestamp: Date
  read: boolean
}

export const OrderNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock: In real app, this would come from WebSocket
  useEffect(() => {
    const handleNewOrder = (newOrder: any) => {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        orderId: newOrder._id,
        customerName: newOrder.user?.name || 'Unknown',
        restaurantName: newOrder.restaurant?.name || 'Unknown',
        items: newOrder.items?.length || 0,
        totalPrice: newOrder.totalPrice,
        orderType: newOrder.orderType || 'delivery',
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Play notification sound
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => {}) // Ignore if sound not available
    }

    // Simulate receiving new orders (replace with WebSocket in production)
    const interval = setInterval(() => {
      // This would be replaced by actual WebSocket listener
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const handleClearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <>
      <Button
        type="text"
        icon={
          <Badge count={unreadCount} style={{ backgroundColor: '#ff4d4f' }}>
            <Bell size={20} style={{ color: '#fff' }} />
          </Badge>
        }
        onClick={() => setDrawerOpen(true)}
        style={{ color: 'white' }}
      />

      <Drawer
        title={
          <Space>
            <ShoppingOutlined />
            <span>Order Notifications</span>
            <Tag color="red">{unreadCount} new</Tag>
          </Space>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
      >
        {notifications.length === 0 ? (
          <Empty description="No notifications yet" />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Button
              danger
              size="small"
              onClick={handleClearAll}
              block
            >
              Clear All
            </Button>

            {notifications.map((notif) => (
              <Card
                key={notif.id}
                size="small"
                style={{
                  backgroundColor: notif.read ? '#f9f9f9' : '#fafafa',
                  borderLeft: notif.read ? 'none' : '4px solid #ff4d4f',
                }}
                hoverable
              >
                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {notif.customerName}
                    </span>
                    <Tag color={notif.orderType === 'delivery' ? 'blue' : 'green'}>
                      {notif.orderType === 'delivery' ? '🚚 Delivery' : '🍽️ Dine In'}
                    </Tag>
                  </div>
                  <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                    Restaurant: {notif.restaurantName}
                  </p>
                  <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                    Items: {notif.items} | Total: ${notif.totalPrice.toFixed(2)}
                  </p>
                  <p style={{ color: '#999', margin: 0, fontSize: '11px' }}>
                    {notif.timestamp.toLocaleTimeString()}
                  </p>

                  {!notif.read && (
                    <Button
                      size="small"
                      onClick={() => handleMarkAsRead(notif.id)}
                      block
                    >
                      Mark as Read
                    </Button>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        )}
      </Drawer>
    </>
  )
}
