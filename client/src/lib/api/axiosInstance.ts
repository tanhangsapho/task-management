import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
  console.log("Access Token Before Request:", Cookies.get("accessToken"));
  const accessToken = Cookies.get("accessToken");
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
