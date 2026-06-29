'use client'
import { AdminContext } from '@/library/admin.context';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { OrderNotifications } from '@/components/admin/order-notifications';

const AdminHeader = (props: any) => {
    // const {data: session, status} = useSession();
    const { session } = props;
    console.log(">>> check data session", session);
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Settings
                </span>
            ),
        },
        // {
        //     key: '2',
        //     label: (
        //         <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        //             2nd menu item (disabled)
        //         </a>
        //     ),
        //     icon: <SmileOutlined />,
        //     disabled: true,
        // },
        // {
        //     key: '3',
        //     label: (
        //         <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        //             3rd menu item (disabled)
        //         </a>
        //     ),
        //     disabled: true,
        // },
        {
            key: '4',
            danger: true,
            label: <span onClick={() => signOut({ callbackUrl: '/auth/login' })}>Đăng xuất</span>,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Space style={{ marginRight: 20 }}>
                    <OrderNotifications />
                    <Dropdown menu={{ items }} >
                        <a onClick={(e) => e.preventDefault()}
                            style={{ color: "unset", lineHeight: "0 !important" }}
                        >
                            <Space>
                                Welcome {session?.user?.name ?? ""}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Space>
            </Header>
        </>
    )
}

export default AdminHeader;