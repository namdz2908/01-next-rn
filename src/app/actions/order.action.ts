'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchOrders(
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

        const response = await sendRequest<IBackendRes<IModelPaginate<any>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
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
            message: "Failed to fetch orders",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function fetchOrderStats() {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/analytics/summary`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch order stats",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createOrder(orderData: any) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
            method: "POST",
            body: orderData,
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to create order",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

