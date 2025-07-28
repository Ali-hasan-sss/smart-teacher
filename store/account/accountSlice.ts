import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface AccountState {
  user: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AccountState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

// -------------- Thunks --------------
// تحديث بيانات الحساب
export const updateAccount = createAsyncThunk(
  "account/update",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/Client/Account", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// حذف الحساب
export const deleteAccount = createAsyncThunk(
  "account/delete",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/Client/Account/DeleteMyAccount");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// تغيير كلمة المرور
export const changePassword = createAsyncThunk(
  "account/changePassword",
  async (
    data: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/ChangePassword",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// جلب بيانات الحساب
export const getAccount = createAsyncThunk(
  "account/getAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Account/GetAccount");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// تجديد رمز Firebase Token
export const refreshFirebaseToken = createAsyncThunk(
  "account/refreshFirebaseToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/refreshFirebaseToken",
        { token }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// نسيت كلمة المرور
export const forgetPassword = createAsyncThunk(
  "account/forgetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/Client/Account/ForgetPassword", {
        email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// تأكيد نسيت كلمة المرور (تغييرها)
export const confirmForgetPassword = createAsyncThunk(
  "account/confirmForgetPassword",
  async (
    data: { email: string; newPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/ConfirmForgetPassword",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// -------------- Slice --------------

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Account
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAccount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = "تم تحديث البيانات بنجاح";
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.successMessage = "تم حذف الحساب بنجاح";
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage = "تم تغيير كلمة المرور بنجاح";
        }
      )
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Account
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Refresh Firebase Token
      .addCase(refreshFirebaseToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshFirebaseToken.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage = "تم تجديد رمز Firebase بنجاح";
        }
      )
      .addCase(refreshFirebaseToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forget Password
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        forgetPassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage = "تم إرسال تعليمات استعادة كلمة المرور";
        }
      )
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Confirm Forget Password
      .addCase(confirmForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        confirmForgetPassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage = "تم تأكيد تغيير كلمة المرور بنجاح";
        }
      )
      .addCase(confirmForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, logout } = accountSlice.actions;
export default accountSlice.reducer;
