'use server'

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";

export async function fetchReviews(query: string = "") {
  try {
    const session = await auth();
    if (!session?.access_token) {
      return { statusCode: 401, message: "Unauthorized", data: null, error: "No access token" };
    }

    const response = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`,
      method: "GET",
      queryParams: { query },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    return response;
  } catch (error) {
    return { statusCode: 500, message: "Failed to fetch reviews", data: null, error: (error as any)?.message };
  }
}

export async function getRatingDistribution(restaurantId?: string) {
  try {
    const session = await auth();
    if (!session?.access_token) {
      return { statusCode: 401, message: "Unauthorized", data: null, error: "No access token" };
    }

    const url = restaurantId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/distribution/${restaurantId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/distribution`;

    const response = await sendRequest<any>({
      url,
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    return response;
  } catch (error) {
    return { statusCode: 500, message: "Failed to get distribution", data: null, error: (error as any)?.message };
  }
}

export async function replyToReview(reviewId: string, adminReply: string) {
  try {
    const session = await auth();
    if (!session?.access_token) {
      return { statusCode: 401, message: "Unauthorized", data: null, error: "No access token" };
    }

    const response = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/reply`,
      method: "POST",
      body: { adminReply },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    return response;
  } catch (error) {
    return { statusCode: 500, message: "Failed to reply review", data: null, error: (error as any)?.message };
  }
}