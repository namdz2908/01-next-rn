'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Row, Col, Button, Input, Form, message, Spin, Radio, Space, Divider, Table, Empty, Steps } from 'antd'
import { ArrowLeftOutlined, CheckCircleOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { createOrder } from '@/app/actions/order.action'

interface CartItem {
  item: {
    _id: string
    name: string
    basePrice: number
  }
  quantity: number
}

const CheckoutPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurant')
  const orderType = searchParams.get('type') || 'delivery'
  const cartParam = searchParams.get('cart')

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [orderCreated, setOrderCreated] = useState<any>(null)

  useEffect(() => {
    if (cartParam) {
      try {
        const parsedCart = JSON.parse(decodeURIComponent(cartParam))
        setCart(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart:', error)
        router.push('/customer/order')
      }
    }
  }, [cartParam, router])

  const totalPrice = cart.reduce((sum, ci) => sum + ci.item.basePrice * ci.quantity, 0)
  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0)

  const cartColumns = [
    {
      title: 'Item',
      dataIndex: ['item', 'name'],
      key: 'name',
    },
    {
      title: 'Price',
      key: 'price',
      render: (_: any, record: CartItem) => `$${record.item.basePrice.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: CartItem) => (
        `$${(record.item.basePrice * record.quantity).toFixed(2)}`
      ),
    },
  ]

  const handleSubmitOrder = async (values: any) => {
    try {
      setLoading(true)

      const orderData = {
        restaurantId,
        items: cart.map((ci) => ({
          menuItemId: ci.item._id,
          quantity: ci.quantity,
          price: ci.item.basePrice,
        })),
        orderType: orderType as 'delivery' | 'dine-in',
        paymentMethod,
        totalPrice,
        ...(orderType === 'delivery' && {
          deliveryAddress: values.deliveryAddress,
          phone: values.phone,
        }),
        ...(orderType === 'dine-in' && {
          tableNumber: values.tableNumber,
          phone: values.phone,
        }),
        notes: values.notes,
      }

      const res = await createOrder(orderData)
      if (res?.statusCode === 201) {
        setOrderCreated(res.data)
        setCurrentStep(2)
        message.success('Order placed successfully!')

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/customer/order-success?orderId=${res.data._id}`)
        }, 2000)
      } else {
        message.error(res?.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      message.error('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !orderCreated) {
    return (
      <Card style={{ marginBottom: '24px' }}>
        <Empty description="Your cart is empty" />
        <Button
          onClick={() => router.push('/customer/order')}
          style={{ marginTop: '16px', width: '100%' }}
        >
          Continue Shopping
        </Button>
      </Card>
    )
  }

  const stepsConfig = [
    { title: 'Review Order', status: currentStep > 0 ? 'finish' : 'process' },
    { title: 'Delivery Info', status: currentStep > 1 ? 'finish' : currentStep === 1 ? 'process' : 'wait' },
    { title: 'Confirmation', status: currentStep > 2 ? 'finish' : currentStep === 2 ? 'process' : 'wait' },
  ]

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Col>
          <Col>
            <h2 style={{ margin: 0 }}>Checkout</h2>
          </Col>
          <Col style={{ minWidth: '100px' }} />
        </Row>
      </Card>

      {/* Progress Steps */}
      <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
        <Steps
          current={currentStep}
          items={stepsConfig}
          responsive={false}
        />
      </Card>

      <Row gutter={24}>
        {/* Left: Form */}
        <Col xs={24} lg={14}>
          {currentStep < 2 && (
            <Card style={{ marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} bordered={false}>
              <Spin spinning={loading}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmitOrder}
                  disabled={loading}
                >
                  {currentStep === 0 && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <h3>Order Details</h3>

                      <div>
                        <h4>Order Type</h4>
                        <p style={{ color: '#666', marginBottom: '8px' }}>
                          {orderType === 'delivery' ? '🚚 Delivery to Home' : '🍽️ Dine In at Restaurant'}
                        </p>
                      </div>

                      <div>
                        <h4>Items</h4>
                        <Table
                          columns={cartColumns}
                          dataSource={cart}
                          pagination={false}
                          rowKey={(record) => record.item._id}
                          size="small"
                        />
                      </div>

                      <Divider />

                      <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => setCurrentStep(1)}
                        style={{ backgroundColor: '#667eea' }}
                      >
                        Continue to Delivery Info
                      </Button>
                    </Space>
                  )}

                  {currentStep === 1 && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <h3>Delivery Information</h3>

                      {orderType === 'delivery' && (
                        <>
                          <Form.Item
                            name="deliveryAddress"
                            label="Delivery Address"
                            rules={[{ required: true, message: 'Please enter delivery address' }]}
                          >
                            <Input placeholder="123 Main Street, City, State 12345" />
                          </Form.Item>
                          <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                          >
                            <Input placeholder="+1-234-567-8900" />
                          </Form.Item>
                        </>
                      )}

                      {orderType === 'dine-in' && (
                        <>
                          <Form.Item
                            name="tableNumber"
                            label="Table Number"
                            rules={[{ required: true, message: 'Please enter table number' }]}
                          >
                            <Input placeholder="e.g., Table 5" />
                          </Form.Item>
                          <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                          >
                            <Input placeholder="+1-234-567-8900" />
                          </Form.Item>
                        </>
                      )}

                      <Form.Item
                        name="notes"
                        label="Special Instructions (Optional)"
                      >
                        <Input.TextArea
                          placeholder="Any special requests or dietary restrictions?"
                          rows={3}
                        />
                      </Form.Item>

                      <h4>Payment Method</h4>
                      <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <Space direction="vertical">
                          <Radio value="cash">💵 Pay with Cash</Radio>
                          <Radio value="card">💳 Pay with Card</Radio>
                          <Radio value="online">💻 Online Payment</Radio>
                        </Space>
                      </Radio.Group>

                      <Divider />

                      <Space style={{ width: '100%' }} size="large">
                        <Button
                          onClick={() => setCurrentStep(0)}
                          style={{ flex: 1 }}
                        >
                          Back
                        </Button>
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={() => {
                            form.validateFields().then(() => {
                              setCurrentStep(2)
                            })
                          }}
                          style={{ flex: 1, backgroundColor: '#667eea' }}
                        >
                          Review Order
                        </Button>
                      </Space>
                    </Space>
                  )}

                  {currentStep === 2 && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <h3>Confirm Your Order</h3>

                      <Card type="inner" title="Order Summary">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Row justify="space-between">
                            <span>Order Type:</span>
                            <strong>{orderType === 'delivery' ? '🚚 Delivery' : '🍽️ Dine In'}</strong>
                          </Row>
                          {orderType === 'delivery' && (
                            <>
                              <Row justify="space-between">
                                <span>Delivery Address:</span>
                                <strong>{form.getFieldValue('deliveryAddress')}</strong>
                              </Row>
                              <Row justify="space-between">
                                <span>Phone:</span>
                                <strong>{form.getFieldValue('phone')}</strong>
                              </Row>
                            </>
                          )}
                          {orderType === 'dine-in' && (
                            <>
                              <Row justify="space-between">
                                <span>Table:</span>
                                <strong>{form.getFieldValue('tableNumber')}</strong>
                              </Row>
                              <Row justify="space-between">
                                <span>Phone:</span>
                                <strong>{form.getFieldValue('phone')}</strong>
                              </Row>
                            </>
                          )}
                          <Row justify="space-between">
                            <span>Payment Method:</span>
                            <strong>
                              {paymentMethod === 'cash'
                                ? '💵 Cash'
                                : paymentMethod === 'card'
                                  ? '💳 Card'
                                  : '💻 Online'}
                            </strong>
                          </Row>
                          {form.getFieldValue('notes') && (
                            <Row justify="space-between">
                              <span>Notes:</span>
                              <strong>{form.getFieldValue('notes')}</strong>
                            </Row>
                          )}
                        </Space>
                      </Card>

                      <Divider />

                      <Space style={{ width: '100%' }} size="large">
                        <Button
                          onClick={() => setCurrentStep(1)}
                          style={{ flex: 1 }}
                        >
                          Back
                        </Button>
                        <Button
                          type="primary"
                          size="large"
                          block
                          loading={loading}
                          onClick={() => form.submit()}
                          style={{ flex: 1, backgroundColor: '#667eea' }}
                        >
                          {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                      </Space>
                    </Space>
                  )}
                </Form>
              </Spin>
            </Card>
          )}
        </Col>

        {/* Right: Order Summary */}
        <Col xs={24} lg={10}>
          <Card
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}
            bordered={false}
          >
            <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Table
                columns={cartColumns}
                dataSource={cart}
                pagination={false}
                rowKey={(record) => record.item._id}
                size="small"
              />

              <Divider />

              <Row justify="space-between" style={{ fontSize: '14px' }}>
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </Row>

              <Row justify="space-between" style={{ fontSize: '14px' }}>
                <span>Delivery Fee:</span>
                <span>${orderType === 'delivery' ? '2.00' : '0.00'}</span>
              </Row>

              <Row justify="space-between" style={{ fontSize: '14px' }}>
                <span>Tax (10%):</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </Row>

              <Divider />

              <Row justify="space-between" style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                <span>Total:</span>
                <span>
                  ${(
                    totalPrice +
                    (orderType === 'delivery' ? 2 : 0) +
                    totalPrice * 0.1
                  ).toFixed(2)}
                </span>
              </Row>

              {currentStep === 2 && orderCreated && (
                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f5ff', borderRadius: '8px' }}>
                  <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '8px' }} />
                  <p style={{ margin: 0, color: '#52c41a', fontWeight: 'bold' }}>
                    Order Placed Successfully!
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
                    Order ID: {orderCreated._id}
                  </p>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CheckoutPage
