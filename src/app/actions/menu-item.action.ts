'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchMenuItems(
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

        const response = await sendRequest<IBackendRes<IModelPaginate<IMenuItem>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
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
            message: "Failed to fetch menu items",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function fetchMenuItemsByMenu(menuId: string) {
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

        const response = await sendRequest<IBackendRes<IModelPaginate<IMenuItem>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
            method: "GET",
            queryParams: { menuId, current: 1, pageSize: 1000 },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch menu items for menu",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createMenuItem(formData: ICreateMenuItemRequest) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items`,
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
            message: "Failed to create menu item",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function updateMenuItem(id: string, formData: Partial<ICreateMenuItemRequest>) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/${id}`,
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
            message: "Failed to update menu item",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function deleteMenuItem(id: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete menu item",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function bulkUpdateMenuItems(itemIds: string[], updateData: { enabled?: boolean, basePrice?: number, category?: string, description?: string }) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-items/bulk`,
            method: "PATCH",
            body: {
                ids: itemIds,
                ...updateData
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to bulk update menu items",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
