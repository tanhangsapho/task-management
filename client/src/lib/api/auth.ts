import axios from "axios";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  accessToken: string;
  refreshToken: string;
}
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}
class AuthAPI {
  private baseUrl = `${API_URL}/api/auth`;

  async getCurrentUser() {
    const token = getCookie("accessToken");
    if (!token) {
      throw new Error("No access token found. User is not logged in.");
    }
    const response = await axios.get<AuthResponse>(
      `${API_URL}/api/user/profile `,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  }

  async logout() {
    await axios.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }

  async refreshToken() {
    const response = await axios.post<AuthResponse>(
      `${this.baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  initiateGoogleAuth() {
    window.location.href = `${this.baseUrl}/google`;
  }

  initiateGithubAuth() {
    window.location.href = `${this.baseUrl}/github`;
  }

  async handleAuthCallback(provider: "google" | "github", code: string) {
    const response = await axios.get<AuthResponse>(
      `${this.baseUrl}/${provider}/callback`,
      {
        params: { code },
        withCredentials: true,
      }
    );
    return response.data;
  }
}

export const authAPI = new AuthAPI();
