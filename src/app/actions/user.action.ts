'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchUsers(
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

        const response = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
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
            message: "Failed to fetch users",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function createUser(formData: ICreateUserRequest) {
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

        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
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
            message: "Failed to create user",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function updateUser(userId: string, formData: IUpdateUserRequest) {
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

        const response = await sendRequest<IBackendRes<IUser>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
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
            message: "Failed to update user",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function deleteUser(userId: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete user",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

export async function fetchUserProfile(userId: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${userId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch user profile",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
