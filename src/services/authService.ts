const TOKEN_KEY = "token";

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  login(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};