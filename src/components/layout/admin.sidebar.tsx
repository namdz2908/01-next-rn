'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    ShopOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'Hỏi Dân IT',
            type: 'group',
            children: [
                {
                    key: 'dashboard',
                    label: <Link href="/dashboard">Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: 'users',
                    label: <Link href="/dashboard/user">Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: 'restaurant',
                    label: <Link href="/dashboard/restaurant">Restaurants</Link>,
                    icon: <ShopOutlined />,
                },
                {
                    key: 'menu',
                    label: <Link href="/dashboard/menu">Menus</Link>,
                    icon: <UnorderedListOutlined />,
                },
                {
                    key: 'feedback',
                    label: <Link href="/dashboard/feedback">Feedbacks</Link>,
                    icon: <MessageOutlined />,
                },
            ],
        },
    ];

    return (
        <Sider collapsed={collapseMenu}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    );
};

export default AdminSideBar;