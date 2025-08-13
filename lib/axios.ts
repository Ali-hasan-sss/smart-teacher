// src/lib/axios.ts
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://coursemanage.runasp.net";

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

    // لا تحاول تعمل refresh إذا كان الخطأ من طلب الـ refresh نفسه
    if (originalRequest.url?.includes("/api/Client/Account/Refresh")) {
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
          `${API_BASE_URL}/api/Client/Account/Refresh`,
          { refreshToken }
        );

        const newToken = res.data.data.token.accessToken;
        const newRefreshToken = res.data.data.token.refreshTokenValue;

        Cookies.set("token", newToken, { secure: true, sameSite: "Strict" });
        Cookies.set("refreshToken", newRefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        instance.defaults.headers.Authorization = `Bearer ${newToken}`;
        onRefreshed(newToken);

        return instance(originalRequest);
      } catch (refreshErr) {
        const axiosErr = refreshErr as AxiosError;

        if (axiosErr.response?.status === 401) {
          Cookies.remove("token");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = "/login?expired=true";
          }
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
