const TOKEN_KEY = "token";
const API_URL = import.meta.env.VITE_API_URL;

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  cnpj: string;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  login(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('clinic_id');
    localStorage.removeItem('user_id');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getClinicId(): number | null {
    const clinicId = localStorage.getItem('clinic_id');
    if (!clinicId) return null;
    const parsed = parseInt(clinicId, 10);
    return isNaN(parsed) ? null : parsed;
  },

  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    if (!userId) return null;
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
  },

  async register(data: RegisterData): Promise<Response> {
    return fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};