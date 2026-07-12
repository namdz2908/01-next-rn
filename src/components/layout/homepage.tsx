'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
    CrownOutlined, 
    DashboardOutlined, 
    UserOutlined, 
    ShoppingOutlined, 
    ArrowRightOutlined,
    BarChartOutlined,
    TeamOutlined,
    RiseOutlined,
    CheckCircleOutlined,
    LoginOutlined,
    UserAddOutlined,
    LoadingOutlined
} from "@ant-design/icons"
import { 
    Row, 
    Col, 
    Card, 
    Button, 
    Statistic, 
    Table, 
    Badge,
    Space,
    Tag,
    Progress,
    Divider,
    Layout,
    Typography,
    Spin,
    Empty,
    message
} from "antd"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { fetchUsers } from '@/app/actions/user.action'
import { fetchOrders } from '@/app/actions/order.action'
import { fetchRestaurants } from '@/app/actions/restaurant.action'
import dayjs from 'dayjs'

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// Mock Data for charts (keep this for demo purposes until we have real analytics data)
const chartData = [
    { month: 'Jan', revenue: 4000, users: 2400 },
    { month: 'Feb', revenue: 3000, users: 1398 },
    { month: 'Mar', revenue: 2000, users: 9800 },
    { month: 'Apr', revenue: 2780, users: 3908 },
    { month: 'May', revenue: 1890, users: 4800 },
    { month: 'Jun', revenue: 2390, users: 3800 },
]

const columns = [
    { title: 'Order ID', dataIndex: '_id', key: '_id', render: (text: string) => `#${text.slice(-6)}` },
    { 
        title: 'Customer',
        key: 'customer',
        render: (_: any, record: any) => record?.user?.name || 'Unknown'
    },
    { 
        title: 'Amount', 
        dataIndex: 'totalPrice', 
        key: 'totalPrice',
        render: (price: number) => `$${price?.toFixed(2) || '0.00'}`
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            let color = status === 'Completed' ? 'green' : status === 'Processing' ? 'blue' : 'orange';
            return <Tag color={color}>{status || 'Pending'}</Tag>;
        },
    },
    { 
        title: 'Date', 
        dataIndex: 'orderTime', 
        key: 'orderTime',
        render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
]

const HomePage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [restaurants, setRestaurants] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalRestaurants: 0,
        growthRate: 0
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                
                // Fetch restaurants
                const restaurantsRes = await fetchRestaurants(1, 100)
                if (restaurantsRes?.statusCode === 200 && restaurantsRes?.data) {
                    const rData = restaurantsRes.data;
                    if (rData.results) {
                        setRestaurants(rData.results)
                    }
                    if (rData.meta?.total) {
                        setStats(prev => ({
                            ...prev,
                            totalRestaurants: rData.meta.total
                        }))
                    }
                }

                // Fetch orders
                const ordersRes = await fetchOrders(1, 4)
                if (ordersRes?.statusCode === 200 && ordersRes?.data) {
                    const oData = ordersRes.data;
                    if (oData.results) {
                        setOrders(oData.results)
                        
                        // Calculate stats from orders
                        const totalRevenue = oData.results.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
                        const totalOrders = oData.meta?.total || oData.results.length
                        
                        setStats(prev => ({
                            ...prev,
                            totalRevenue: totalRevenue,
                            totalOrders: totalOrders
                        }))
                    }
                }
                
            } catch (error) {
                console.error("Error loading data:", error)
                message.error("Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return (
        <Content style={{ padding: '0' }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '60px 40px',
                marginBottom: '40px',
                borderRadius: '8px'
            }}>
                <Row align="middle" justify="space-between">
                    <Col xs={24} sm={24} md={12}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Space size={10}>
                                    <CrownOutlined style={{ fontSize: '32px' }} />
                                    <Title level={1} style={{ color: 'white', margin: 0 }}>Admin Dashboard</Title>
                                </Space>
                            </div>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                                Welcome to your complete business management platform. Monitor sales, manage orders, and grow your business efficiently.
                            </Paragraph>
                            <div>
                                <Space size="middle">
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        icon={<ShoppingOutlined />}
                                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                        onClick={() => router.push('/customer/order')}
                                    >
                                        Order Now
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        icon={<LoginOutlined />}
                                        style={{ backgroundColor: 'white', color: '#667eea', borderColor: 'white' }}
                                        onClick={() => router.push('/auth/login')}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        size="large"
                                        icon={<UserAddOutlined />}
                                        style={{ backgroundColor: 'white', color: '#667eea', borderColor: 'white' }}
                                        onClick={() => router.push('/auth/register')}
                                    >
                                        Sign Up
                                    </Button>
                                </Space>
                            </div>
                        </Space>
                    </Col>
                    <Col xs={0} sm={0} md={12} style={{ textAlign: 'center' }}>
                        <DashboardOutlined style={{ fontSize: '120px', opacity: 0.3 }} />
                    </Col>
                </Row>
            </div>

            {/* Key Metrics */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={2} style={{ marginBottom: '20px' }}>Overview</Title>
                {loading ? (
                    <Row gutter={[16, 16]}>
                        <Col xs={24}><Spin /></Col>
                    </Row>
                ) : (
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card 
                                bordered={false}
                                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                <Statistic
                                    title="Total Revenue"
                                    value={stats.totalRevenue}
                                    prefix="$"
                                    valueStyle={{ color: '#1890ff' }}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card 
                                bordered={false}
                                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                <Statistic
                                    title="Total Orders"
                                    value={stats.totalOrders}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<ShoppingOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card 
                                bordered={false}
                                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                <Statistic
                                    title="Total Restaurants"
                                    value={stats.totalRestaurants}
                                    valueStyle={{ color: '#faad14' }}
                                    prefix={<ShoppingOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card 
                                bordered={false}
                                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                                <Statistic
                                    title="Growth Rate"
                                    value={stats.growthRate}
                                    suffix="%"
                                    valueStyle={{ color: '#eb2f96' }}
                                    precision={1}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>

            {/* Charts Section */}
            <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                <Col xs={24} md={12}>
                    <Card 
                        title="Revenue Trend"
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card 
                        title="User Growth"
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="users" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Orders */}
            <div style={{ marginBottom: '40px' }}>
                <Card 
                    title="Recent Orders"
                    extra={<Button type="link">View All</Button>}
                    bordered={false}
                    style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    loading={loading}
                >
                    {orders.length > 0 ? (
                        <Table 
                            columns={columns} 
                            dataSource={orders.map((order: any) => ({ ...order, key: order._id }))}
                            pagination={false}
                            size="small"
                        />
                    ) : (
                        <Empty description="No orders yet" style={{ padding: '40px 0' }} />
                    )}
                </Card>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '40px' }}>
                <Title level={2} style={{ marginBottom: '20px' }}>Key Features</Title>
                <Row gutter={[16, 16]}>
                    {[
                        { icon: <DashboardOutlined />, title: 'Real-time Dashboard', desc: 'Monitor your business metrics in real-time' },
                        { icon: <ShoppingOutlined />, title: 'Order Management', desc: 'Manage all orders efficiently' },
                        { icon: <UserOutlined />, title: 'User Management', desc: 'Control user access and permissions' },
                        { icon: <BarChartOutlined />, title: 'Analytics & Reports', desc: 'Detailed insights and analytics' },
                    ].map((feature, idx) => (
                        <Col xs={24} sm={12} md={6} key={idx}>
                            <Card 
                                bordered={false}
                                style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '12px', color: '#1890ff' }}>
                                    {feature.icon}
                                </div>
                                <Title level={4}>{feature.title}</Title>
                                <Text type="secondary">{feature.desc}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* CTA Section */}
            <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
                <Col xs={24} md={12}>
                    <Card 
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '8px',
                            border: 'none',
                            color: 'white',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                        bordered={false}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Title level={3} style={{ color: 'white', margin: 0 }}>🛍️ Start Ordering Food</Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                Browse delicious meals from your favorite restaurants and get delivery in minutes
                            </Paragraph>
                            <div>
                                <Button 
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingOutlined />}
                                    style={{ backgroundColor: 'white', color: '#667eea', borderColor: 'white' }}
                                    onClick={() => router.push('/customer/order')}
                                >
                                    Order Now
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card 
                        style={{
                            background: 'linear-gradient(135deg, #faad14 0%, #ff7a45 100%)',
                            borderRadius: '8px',
                            border: 'none',
                            color: 'white',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                        bordered={false}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Title level={3} style={{ color: 'white', margin: 0 }}>📊 Admin Dashboard</Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                                Manage your business, track orders, and grow your restaurant with analytics
                            </Paragraph>
                            <div>
                                <Button 
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    style={{ backgroundColor: 'white', color: '#faad14', borderColor: 'white' }}
                                    onClick={() => router.push('/auth/login')}
                                >
                                    Get Started Now
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

export default HomePage;

