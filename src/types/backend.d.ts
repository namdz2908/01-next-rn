export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        user: {
            _id: string;
            name: string;
            email: string;
        },
        access_token: string;
    }

    interface IUser {
        _id?: string;
        email: string;
        name: string;
        age?: number;
        address?: string;
        createdAt?: string;
        updatedAt?: string;
    }

    interface ICreateUserRequest {
        email: string;
        name: string;
        password: string;
        age?: number;
        address?: string;
    }

    interface IUpdateUserRequest {
        email?: string;
        name?: string;
        age?: number;
        address?: string;
    }

    interface IRestaurant {
        _id?: string;
        name: string;
        phone: string;
        address: string;
        email: string;
        rating?: number;
        hours?: string; // JSON string
        createdAt?: string;
        updatedAt?: string;
    }

    interface IMenu {
        _id?: string;
        restaurant: string | IRestaurant;
        title: string;
        description?: string;
        image?: string;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IMenuItem {
        _id?: string;
        menu: string | IMenu;
        category: string | IMenuCategory;
        title: string;
        description?: string;
        basePrice: number;
        image?: string;
        enabled: boolean;
        createdAt?: string;
        updatedAt?: string;
    }

    interface IMenuCategory {
        _id?: string;
        menu: string | IMenu;
        name: string;
        displayOrder: number;
        createdAt?: string;
        updatedAt?: string;
    }

    interface ICreateRestaurantRequest {
        name: string;
        phone: string;
        address: string;
        email: string;
        hours?: string;
    }

    interface ICreateMenuRequest {
        restaurant: string;
        title: string;
        description?: string;
        image?: string;
    }

    interface ICreateMenuItemRequest {
        menu: string;
        category: string;
        title: string;
        description?: string;
        basePrice: number;
        image?: string;
        enabled?: boolean;
    }

    interface ICreateMenuCategoryRequest {
        menu: string;
        name: string;
        displayOrder?: number;
    }
}

