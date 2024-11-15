require("dotenv").config();

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const googleAuth = {
  // Initialize Google login
  signInWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },

  // Handle the callback after Google auth
  handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
    try {
      const response = await axios.get<AuthResponse>(
        `${API_URL}/auth/google/callback?code=${code}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Google auth error:", error);
      throw new Error("Google authentication failed");
    }
  },
};
export const githubAuth = {
  signInWithGithub: () => {
    window.location.href = `${API_URL}/api/auth/github`;
  },

  handleGithubCallback: async (code: string): Promise<AuthResponse> => {
    // Updated function name
    try {
      const response = await axios.get<AuthResponse>(
        `${API_URL}/auth/github/callback?code=${code}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("GitHub auth error:", error);
      throw new Error("GitHub authentication failed");
    }
  },
};
