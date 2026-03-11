import { authService } from "./authService";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {

  const token = authService.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers
  });
}