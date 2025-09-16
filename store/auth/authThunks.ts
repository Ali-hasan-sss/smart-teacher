// src/store/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import axios from "@/lib/axios";
import Cookies from "js-cookie";

export const login = createAsyncThunk<
  { user: any; token: string },
  LoginRequest,
  { rejectValue: { message: string; code?: number } }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/Client/Account/Login", credentials);

    if (!response.data.isSuccess) {
      const code = response.data.code ?? 400;
      const message =
        code === 500
          ? "حدث خطأ ما"
          : (response.data.message || "فشل تسجيل الدخول").split("\n")[0];

      return rejectWithValue({ message, code });
    }

    const token = response.data.data.token.accessToken;
    const refreshToken = response.data.data.token.refreshTokenValue;
    const user = response.data.data;

    Cookies.set("token", token);
    Cookies.set("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  } catch (err: any) {
    const code = err.response?.data?.code ?? 500;
    const message =
      code === 500
        ? "حدث خطأ ما"
        : err.response?.data?.message?.split("\n")[0] || "فشل تسجيل الدخول";

    return rejectWithValue({ message, code });
  }
});

export const register = createAsyncThunk<
  { user: any; token?: string },
  RegisterRequest,
  { rejectValue: { message: string; code?: number } }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/Client/Account/Register", payload);

    if (!response.data.isSuccess) {
      const code = response.data.code ?? 400;
      const message =
        code === 500
          ? "حدث خطأ ما"
          : (response.data.message || "فشل التسجيل").split("\n")[0];

      return rejectWithValue({ message, code });
    }

    const token = response.data.data.token?.accessToken;
    const refreshToken = response.data.data.token?.refreshTokenValue;
    const user = response.data.data;

    if (token) Cookies.set("token", token);
    if (refreshToken) Cookies.set("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { user, token };
  } catch (err: any) {
    const code = err.response?.data?.code ?? 500;
    const message =
      code === 500
        ? "حدث خطأ ما"
        : err.response?.data?.message?.split("\n")[0] || "فشل التسجيل";

    return rejectWithValue({ message, code });
  }
});
