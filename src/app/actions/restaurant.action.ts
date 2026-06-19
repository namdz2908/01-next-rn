'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchRestaurants(
    current: number = 1,
    pageSize: number = 10
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

        const response = await sendRequest<IBackendRes<IModelPaginate<IRestaurant>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
            method: "GET",
            queryParams: { current, pageSize },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch restaurants",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function fetchRestaurant(id: string) {
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

        const response = await sendRequest<IBackendRes<IRestaurant>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch restaurant",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createRestaurant(formData: ICreateRestaurantRequest) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`,
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
            message: "Failed to create restaurant",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function updateRestaurant(id: string, formData: Partial<ICreateRestaurantRequest>) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
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
            message: "Failed to update restaurant",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function deleteRestaurant(id: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete restaurant",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
