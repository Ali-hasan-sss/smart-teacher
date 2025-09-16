// src/store/home/homeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchClientHome,
  fetchTeacherHome,
  fetchParentHome,
} from "./homeThunks";
import { ClientHomeData, TeacherHomeData, ParentHomeData } from "@/types/home";

interface HomeState {
  clientData: ClientHomeData | null;
  teacherData: TeacherHomeData | null;
  parentData: ParentHomeData | null;
  loading: boolean;
  teacherLoading: boolean;
  parentLoading: boolean;
  error: string | null;
  teacherError: string | null;
  parentError: string | null;
}

const initialState: HomeState = {
  clientData: null,
  teacherData: null,
  parentData: null,
  loading: false,
  teacherLoading: false,
  parentLoading: false,
  error: null,
  teacherError: null,
  parentError: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeError(state) {
      state.error = null;
    },
    clearTeacherError(state) {
      state.teacherError = null;
    },
    clearParentError(state) {
      state.parentError = null;
    },
    setClientData(state, action: PayloadAction<ClientHomeData>) {
      state.clientData = action.payload;
    },
    setTeacherData(state, action: PayloadAction<TeacherHomeData>) {
      state.teacherData = action.payload;
    },
    setParentData(state, action: PayloadAction<ParentHomeData>) {
      state.parentData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Client Home
      .addCase(fetchClientHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientHome.fulfilled, (state, action) => {
        state.loading = false;
        state.clientData = action.payload.data ?? null;
        state.error = null;
      })
      .addCase(fetchClientHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "خطأ غير معروف";
      })
      // Teacher Home
      .addCase(fetchTeacherHome.pending, (state) => {
        state.teacherLoading = true;
        state.teacherError = null;
      })
      .addCase(fetchTeacherHome.fulfilled, (state, action) => {
        state.teacherLoading = false;
        state.teacherData = action.payload.data ?? null;
        state.teacherError = null;
      })
      .addCase(fetchTeacherHome.rejected, (state, action) => {
        state.teacherLoading = false;
        state.teacherError =
          action.payload ?? action.error.message ?? "خطأ غير معروف";
      })
      // Parent Home
      .addCase(fetchParentHome.pending, (state) => {
        state.parentLoading = true;
        state.parentError = null;
      })
      .addCase(fetchParentHome.fulfilled, (state, action) => {
        state.parentLoading = false;
        state.parentData = action.payload.data ?? null;
        state.parentError = null;
      })
      .addCase(fetchParentHome.rejected, (state, action) => {
        state.parentLoading = false;
        state.parentError =
          action.payload ?? action.error.message ?? "خطأ غير معروف";
      });
  },
});

export const {
  clearHomeError,
  clearTeacherError,
  clearParentError,
  setClientData,
  setTeacherData,
  setParentData,
} = homeSlice.actions;
export default homeSlice.reducer;
