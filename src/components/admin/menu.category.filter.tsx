'use client'

import { Select } from "antd";

interface IMenuCategoryFilterProps {
    categories: IMenuCategory[];
    selectedCategoryId: string | null;
    onChange: (categoryId: string | null) => void;
}

const MenuCategoryFilter = ({
    categories,
    selectedCategoryId,
    onChange,
}: IMenuCategoryFilterProps) => {
    const options = [
        { label: 'All Categories', value: '' },
        ...categories
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(cat => ({ label: cat.name, value: cat._id ?? '' })),
    ];

    return (
        <Select
            style={{ minWidth: 180 }}
            options={options}
            value={selectedCategoryId ?? ''}
            onChange={(val) => onChange(val || null)}
            placeholder="Filter by category"
        />
    );
};

export default MenuCategoryFilter;
