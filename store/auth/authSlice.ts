import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import Cookies from "js-cookie";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

try {
  if (typeof window !== "undefined") {
    const token = Cookies.get("token") || null;
    const userJson = localStorage.getItem("user") || null;

    if (token) initialState.token = token;
    if (userJson) initialState.user = JSON.parse(userJson);
  }
} catch (error) {
  console.error("Failed to parse user:", error);
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      // تخزين نسخة من المستخدم بدون التوكنات
      const { token, ...userWithoutTokens } = action.payload;
      localStorage.setItem("user", JSON.stringify(userWithoutTokens));
    },
  },
  extraReducers: (builder) => {
    builder
      // login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: any; token: string }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;

          // حفظ التوكنات في الكوكيز
          Cookies.set("token", action.payload.token, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set(
            "refreshToken",
            action.payload.user.token.refreshTokenValue,
            { secure: true, sameSite: "Strict" }
          );

          // تخزين نسخة من المستخدم بدون التوكنات
          const { token, ...userWithoutTokens } = action.payload.user;
          localStorage.setItem("user", JSON.stringify(userWithoutTokens));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          state.error = action.payload.message;
        } else if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.error = "Login failed";
        }
      })

      // register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ user: any; token?: string }>) => {
          state.loading = false;
          state.token = action.payload.token ?? null;
          state.user = action.payload.user;

          // حفظ التوكنات في الكوكيز
          if (action.payload.token) {
            Cookies.set("token", action.payload.token, {
              secure: true,
              sameSite: "Strict",
            });
          }
          if (action.payload.user.token?.refreshTokenValue) {
            Cookies.set(
              "refreshToken",
              action.payload.user.token.refreshTokenValue,
              { secure: true, sameSite: "Strict" }
            );
          }

          // تخزين نسخة من المستخدم بدون التوكنات
          const { token, ...userWithoutTokens } = action.payload.user;
          localStorage.setItem("user", JSON.stringify(userWithoutTokens));
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;

        if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          state.error = action.payload.message;
        } else if (typeof action.payload === "string") {
          state.error = action.payload;
        } else {
          state.error = "Registration failed";
        }
      });
  },
});

export const isLoggedIn = (state: { auth: AuthState }) =>
  Boolean(state.auth.user && state.auth.token);

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
