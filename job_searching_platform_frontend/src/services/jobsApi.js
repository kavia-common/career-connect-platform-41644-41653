import { http } from "./httpClient";

/**
 * PUBLIC_INTERFACE
 * List jobs with filters.
 * @param {{ q?: string, skills?: string[], location?: string, type?: string, seniority?: string, page?: number, pageSize?: number }} params
 */
export async function listJobs(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.skills?.length) searchParams.set("skills", params.skills.join(","));
  if (params.location) searchParams.set("location", params.location);
  if (params.type) searchParams.set("type", params.type);
  if (params.seniority) searchParams.set("seniority", params.seniority);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

  const qs = searchParams.toString();
  return http.get(`/jobs${qs ? `?${qs}` : ""}`);
}

/**
 * PUBLIC_INTERFACE
 * Get job details.
 * @param {string} id
 */
export async function getJob(id) {
  return http.get(`/jobs/${encodeURIComponent(id)}`);
}
