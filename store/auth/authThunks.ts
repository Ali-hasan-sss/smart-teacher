// src/store/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import axios from "@/lib/axios";
import Cookies from "js-cookie";

export const login = createAsyncThunk<
  { user: any; token: string },
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/Client/Account/Login", credentials);

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Login failed");
    }

    const token = response.data.data.token.accessToken;
    const refreshToken = response.data.data.token.refreshTokenValue;

    // حفظ التوكنات في الكوكيز
    Cookies.set("token", token, { secure: true });
    Cookies.set("refreshToken", refreshToken, { secure: true });

    return {
      token,
      user: response.data.data,
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login error");
  }
});

export const register = createAsyncThunk<
  { user: any; token?: string },
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/Client/Account/Register", payload);

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "Register failed");
    }

    const token = response.data.data.token?.accessToken;
    const refreshToken = response.data.data.token?.refreshTokenValue;

    if (token) Cookies.set("token", token, { secure: true });
    if (refreshToken)
      Cookies.set("refreshToken", refreshToken, { secure: true });

    return { user: response.data.data, token };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Register error");
  }
});
