'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchMenuCategories(
    current: number = 1,
    pageSize: number = 1000,
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

        const response = await sendRequest<IBackendRes<IModelPaginate<IMenuCategory>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-categories`,
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
            message: "Failed to fetch menu categories",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createMenuCategory(formData: ICreateMenuCategoryRequest) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-categories`,
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
            message: "Failed to create menu category",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function updateMenuCategory(id: string, formData: Partial<ICreateMenuCategoryRequest>) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-categories/${id}`,
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
            message: "Failed to update menu category",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function deleteMenuCategory(id: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/menu-categories/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete menu category",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
