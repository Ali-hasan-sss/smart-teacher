import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import Cookies from "js-cookie";
import { RootState } from "@/store";

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
  const token = Cookies.get("token") || null;
  const userJson = Cookies.get("user") || null;
  if (token) initialState.token = token;
  if (userJson) initialState.user = JSON.parse(userJson);
} catch (error) {
  console.error("Failed to parse user from cookies:", error);
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
      Cookies.remove("user");
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
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

          Cookies.set("token", action.payload.token);
          Cookies.set("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

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

          if (action.payload.token) {
            Cookies.set("token", action.payload.token);
          }
          Cookies.set("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      });
  },
});

export const isLoggedIn = (state: { auth: AuthState }) =>
  Boolean(state.auth.user && state.auth.token);

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
