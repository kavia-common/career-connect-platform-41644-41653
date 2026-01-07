import { http } from "./httpClient";

/**
 * PUBLIC_INTERFACE
 * List notifications for the authenticated user.
 * @param {{ unreadOnly?: boolean, page?: number, pageSize?: number }} params
 */
export async function listNotifications(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.unreadOnly !== undefined)
    searchParams.set("unreadOnly", String(params.unreadOnly));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const qs = searchParams.toString();
  return http.get(`/notifications${qs ? `?${qs}` : ""}`);
}

/**
 * PUBLIC_INTERFACE
 * Mark notifications read.
 * @param {{ ids: string[] }} payload
 */
export async function markRead(payload) {
  return http.post("/notifications/mark-read", payload);
}
