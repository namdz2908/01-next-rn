'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchMenus(
    current: number = 1,
    pageSize: number = 10,
    queryParams?: any
) {
    try {
        const session = await auth();
        if (!session?.access_token) {
            return {
                statusCode: 401,
                message: "Unauthorized",
                data: null,
                error: "No access token"
            };
        }

        const response = await sendRequest<IBackendRes<IModelPaginate<IMenu>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "GET",
            queryParams: { current, pageSize, ...queryParams },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch menus",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function fetchMenusByRestaurant(restaurantId: string) {
    try {
        const session = await auth();
        if (!session?.access_token) {
            return {
                statusCode: 401,
                message: "Unauthorized",
                data: null,
                error: "No access token"
            };
        }

        // We fetch with a large pageSize to get all menus of this restaurant
        const response = await sendRequest<IBackendRes<IModelPaginate<IMenu>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "GET",
            queryParams: { restaurantId, current: 1, pageSize: 1000 },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch menus for restaurant",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createMenu(formData: ICreateMenuRequest) {
    try {
        const session = await auth();
        if (!session?.access_token) {
            return {
                statusCode: 401,
                message: "Unauthorized",
                data: null,
                error: "No access token"
            };
        }

        const response = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus`,
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to create menu",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function updateMenu(id: string, formData: Partial<ICreateMenuRequest>) {
    try {
        const session = await auth();
        if (!session?.access_token) {
            return {
                statusCode: 401,
                message: "Unauthorized",
                data: null,
                error: "No access token"
            };
        }

        const response = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/${id}`,
            method: "PATCH",
            body: formData,
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to update menu",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function deleteMenu(id: string) {
    try {
        const session = await auth();
        if (!session?.access_token) {
            return {
                statusCode: 401,
                message: "Unauthorized",
                data: null,
                error: "No access token"
            };
        }

        const response = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menus/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete menu",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
