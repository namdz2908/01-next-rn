'use client'

import { Select, notification, Spin } from "antd";
import { useEffect, useState } from "react";
import MenuTable from "@/components/admin/menu.table";
import MenuItemTable from "@/components/admin/menu.item.table";
import { fetchRestaurants } from "@/app/actions/restaurant.action";
import { fetchMenusByRestaurant } from "@/app/actions/menu.action";
import { fetchMenuItemsByMenu } from "@/app/actions/menu-item.action";
import { fetchMenuCategories } from "@/app/actions/menu-category.action";

export default function MenuPage() {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [categories, setCategories] = useState<IMenuCategory[]>([]);

    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);

    const [loadingRestaurants, setLoadingRestaurants] = useState(false);
    const [loadingMenus, setLoadingMenus] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);

    // Load restaurants on mount
    useEffect(() => {
        const load = async () => {
            setLoadingRestaurants(true);
            try {
                const res = await fetchRestaurants(1, 1000);
                if (res.statusCode === 200 && res.data) {
                    setRestaurants(res.data.result);
                } else {
                    notification.error({ message: 'Failed to load restaurants' });
                }
            } finally {
                setLoadingRestaurants(false);
            }
        };
        load();
    }, []);

    // Load menus when restaurant changes
    useEffect(() => {
        if (!selectedRestaurantId) {
            setMenus([]);
            setSelectedMenu(null);
            setMenuItems([]);
            setCategories([]);
            return;
        }
        const load = async () => {
            setLoadingMenus(true);
            try {
                const res = await fetchMenusByRestaurant(selectedRestaurantId);
                if (res.statusCode === 200 && res.data) {
                    setMenus(res.data.result);
                }
            } finally {
                setLoadingMenus(false);
            }
        };
        load();
        setSelectedMenu(null);
        setMenuItems([]);
        setCategories([]);
    }, [selectedRestaurantId]);

    // Load menu items + categories when menu changes
    const loadMenuData = async (menu: IMenu) => {
        if (!menu._id) return;
        setLoadingItems(true);
        try {
            const [itemsRes, catsRes] = await Promise.all([
                fetchMenuItemsByMenu(menu._id),
                fetchMenuCategories(1, 1000, { menuId: menu._id }),
            ]);
            if (itemsRes.statusCode === 200 && itemsRes.data) {
                setMenuItems(itemsRes.data.result);
            }
            if (catsRes.statusCode === 200 && catsRes.data) {
                setCategories(catsRes.data.result);
            }
        } finally {
            setLoadingItems(false);
        }
    };

    const handleSelectMenu = (menu: IMenu | null) => {
        setSelectedMenu(menu);
        if (menu) {
            loadMenuData(menu);
        } else {
            setMenuItems([]);
            setCategories([]);
        }
    };

    const handleMenusRefresh = async () => {
        if (!selectedRestaurantId) return;
        setLoadingMenus(true);
        try {
            const res = await fetchMenusByRestaurant(selectedRestaurantId);
            if (res.statusCode === 200 && res.data) {
                setMenus(res.data.result);
            }
        } finally {
            setLoadingMenus(false);
        }
    };

    const handleItemsRefresh = async () => {
        if (selectedMenu?._id) {
            await loadMenuData(selectedMenu);
        }
    };

    const restaurantOptions = restaurants.map(r => ({ label: r.name, value: r._id }));

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>Menu Management</h2>

            {/* Restaurant selector */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 500 }}>Restaurant:</span>
                <Spin spinning={loadingRestaurants} size="small">
                    <Select
                        style={{ minWidth: 280 }}
                        options={restaurantOptions}
                        value={selectedRestaurantId}
                        onChange={(val) => setSelectedRestaurantId(val)}
                        placeholder="Select a restaurant..."
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Spin>
            </div>

            {/* Two-panel layout: menus | menu items */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
                {/* Left panel: Menu list */}
                <div style={{
                    border: '1px solid #e8e8e8',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                    minHeight: 400,
                }}>
                    <MenuTable
                        restaurantId={selectedRestaurantId ?? ''}
                        menus={menus}
                        loading={loadingMenus}
                        onRefresh={handleMenusRefresh}
                        onSelectMenu={handleSelectMenu}
                        selectedMenuId={selectedMenu?._id}
                    />
                </div>

                {/* Right panel: Menu items */}
                <div style={{
                    border: '1px solid #e8e8e8',
                    borderRadius: 8,
                    padding: 16,
                    background: '#fff',
                    minHeight: 400,
                }}>
                    {selectedMenu ? (
                        <MenuItemTable
                            menuId={selectedMenu._id ?? ''}
                            menuItems={menuItems}
                            categories={categories}
                            loading={loadingItems}
                            onRefresh={handleItemsRefresh}
                        />
                    ) : (
                        <div style={{ color: '#888', marginTop: 40, textAlign: 'center' }}>
                            ← Select a menu from the left to manage its items
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
