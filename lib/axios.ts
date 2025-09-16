// src/lib/axios.ts
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://181.214.100.217:3003";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("lang") || "ar";
      config.headers["Accept-Language"] = lang;
      config.headers["lang"] = lang;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const refreshToken = Cookies.get("refreshToken");

    if (originalRequest.url?.includes("/api/Client/Account/RefreshToken")) {
      return Promise.reject(err);
    }

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/Client/Account/RefreshToken`,
          { refreshToken }
        );

        console.log("Refresh token response:", res.data);

        // التحقق من نجاح العملية
        if (!res.data.data.token.success) {
          throw new Error("Token refresh failed");
        }

        const newToken = res.data.data.token.accessToken;
        const newRefreshToken = res.data.data.token.refreshTokenValue;

        if (!newToken || !newRefreshToken) {
          throw new Error("Invalid token data received");
        }

        console.log("Setting new tokens:", {
          newToken: newToken.substring(0, 20) + "...",
          newRefreshToken: newRefreshToken.substring(0, 20) + "...",
        });

        Cookies.set("token", newToken, { secure: true, sameSite: "Strict" });
        Cookies.set("refreshToken", newRefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        instance.defaults.headers.Authorization = `Bearer ${newToken}`;
        onRefreshed(newToken);

        return instance(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh error:", refreshErr);
        const axiosErr = refreshErr as AxiosError;

        // إزالة التوكنات في حالة فشل التحديث
        Cookies.remove("token");
        Cookies.remove("refreshToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=true";
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
