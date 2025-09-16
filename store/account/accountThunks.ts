import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
// ----------------- Thunks -----------------

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
export const deleteAccount = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("account/delete", async (password: string, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/Client/Account/DeleteMyAccount", {
      password,
    });

    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message || "حدث خطأ");
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

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

// ----------------- إدارة البريد/الهاتف -----------------

export const verifyEmail = createAsyncThunk(
  "account/verifyEmail",
  async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/VerifyEmail",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resendEmailVerification = createAsyncThunk(
  "account/resendEmailVerification",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/ResendEmailVerification",
        { email }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const requestChangeEmail = createAsyncThunk(
  "account/requestChangeEmail",
  async (data: { newEmail: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/RequestChangeEmail",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const confirmChangeEmail = createAsyncThunk(
  "account/confirmChangeEmail",
  async (data: { newEmail: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/ConfirmChangeEmail",
        data
      );
      return {
        ...response.data,
        newEmail: data.newEmail, // Include the new email in response
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const requestChangePhone = createAsyncThunk(
  "account/requestChangePhone",
  async (data: { newPhone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/RequestChangePhone",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const confirmChangePhone = createAsyncThunk(
  "account/confirmChangePhone",
  async (data: { newPhone: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Account/ConfirmChangePhone",
        data
      );
      return {
        ...response.data,
        newPhone: data.newPhone, // Include the new phone in response
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ----------------- نسيت كلمة المرور -----------------

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

export const confirmForgetPassword = createAsyncThunk(
  "account/confirmForgetPassword",
  async (
    data: { email: string; newPassword: string; code: string },
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

export const getParentAccounts = createAsyncThunk(
  "account/getParentAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Account/parents");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
//edit firebace token
export const refreshFirebaseToken = createAsyncThunk<
  void,
  string,
  { state: any }
>("auth/refreshFirebaseToken", async (firebaseToken, { getState }) => {
  if (typeof window === "undefined") return; // حماية من SSR

  const oldToken = localStorage.getItem("firebaseToken");
  if (oldToken === firebaseToken) return;

  await axios.post("/api/Client/Account/refreshFirebaseToken", {
    oldFirebaseToken: oldToken || "",
    firebaseToken,
  });

  localStorage.setItem("firebaseToken", firebaseToken);
});

//
export const changePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>("account/changePassword", async (passwords, { rejectWithValue }) => {
  try {
    await axios.post("/api/Client/Account/ChangePassword", passwords);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Generate Register QR Code
export const generateRegisterQR = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("account/generateRegisterQR", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/Client/Account/Generate/RegisterQR");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Add Parent Child Relationship
interface AddParentChildPayload {
  qruId: string;
}

export const addParentChild = createAsyncThunk<
  any,
  AddParentChildPayload,
  { rejectValue: string }
>("account/addParentChild", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "/api/Client/Account/AddParentChild",
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Get Parents
export const getParents = createAsyncThunk<any, void, { rejectValue: string }>(
  "account/getParents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Account/parents");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get Children
export const getChildren = createAsyncThunk<any, void, { rejectValue: string }>(
  "account/getChildren",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Account/children");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove Parent Child Relationship
interface RemoveParentChildPayload {
  childId: number;
  parentId: number;
}

export const removeParentChild = createAsyncThunk<
  any,
  RemoveParentChildPayload,
  { rejectValue: string }
>("account/removeParentChild", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "/api/Client/Account/RemoveParentChild",
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});
