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

  console.log('API Request:', { url, method: options.method || 'GET', hasToken: !!token });

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    console.log('API Response:', { url, status: response.status, statusText: response.statusText });
    return response;
  } catch (error) {
    console.error('API Error:', { url, error });
    throw error;
  }
}