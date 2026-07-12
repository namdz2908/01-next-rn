'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

// Guest submits feedback - NO AUTH NEEDED
export async function submitGuestFeedback(data: ICreateFeedbackRequest) {
    try {
        const response = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks`,
            method: "POST",
            body: data,
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Gửi phản hồi thất bại",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

// Admin: fetch feedbacks with pagination and optional status filter
export async function fetchFeedbacks(current: number = 1, pageSize: number = 10, status?: string) {
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
        const queryParams: any = { current, pageSize };
        if (status) queryParams.status = status;

        const response = await sendRequest<IBackendRes<IModelPaginate<IFeedback>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks`,
            method: "GET",
            queryParams,
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch feedbacks",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

// Admin: get stats
export async function fetchFeedbackStats() {
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
        const response = await sendRequest<IBackendRes<IFeedbackStats>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks/stats`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to fetch stats",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

// Admin: reply to feedback
export async function replyFeedback(id: string, adminReply: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks/${id}/reply`,
            method: "POST",
            body: { adminReply },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to reply feedback",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

// Admin: update feedback status
export async function updateFeedbackStatus(id: string, status: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks/${id}`,
            method: "PATCH",
            body: { status },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to update feedback",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}

// Admin: delete feedback
export async function deleteFeedback(id: string) {
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
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/feedbacks/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            message: "Failed to delete feedback",
            data: null,
            error: (error as any)?.message || "Internal server error"
        };
    }
}
