import axiosInstance from "./axiosInstance";
import Cookies from "js-cookie";

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    photos?: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthAPI {
  private baseUrl = "/api/auth";

  async getCurrentUser() {
    console.log("Access Token Before Request:", Cookies.get("accessToken"));
    const response = await axiosInstance.get<AuthResponse>("/api/user/profile");
    console.log(response.data);
    return response.data;
  }

  async logout() {
    await axiosInstance.post(`${this.baseUrl}/logout`, {});
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  async refreshToken() {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `${this.baseUrl}/refresh-token`,
        {},
        { withCredentials: true }
      );
      console.log("Refreshed Token Response:", response.data);
      if (response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.logout();
      throw error;
    }
  }

  initiateGoogleAuth() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/google`;
  }

  initiateGithubAuth() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/github`;
  }
}

export const authAPI = new AuthAPI();
