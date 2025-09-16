// src/store/home/homeThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import {
  ClientHomeResponse,
  TeacherHomeResponse,
  ParentHomeResponse,
} from "@/types/home";

// === Client Home Thunk ===
export const fetchClientHome = createAsyncThunk<
  ClientHomeResponse,
  void,
  { rejectValue: string }
>("home/fetchClientHome", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<ClientHomeResponse>(
      "/api/Client/Home/ClientHome"
    );
    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "حدث خطأ أثناء جلب بيانات الصفحة الرئيسية للعميل";
    return rejectWithValue(msg);
  }
});

// === Teacher Home Thunk ===
export const fetchTeacherHome = createAsyncThunk<
  TeacherHomeResponse,
  void,
  { rejectValue: string }
>("home/fetchTeacherHome", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<TeacherHomeResponse>(
      "/api/Client/Home/TeacherHome"
    );
    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "حدث خطأ أثناء جلب بيانات الصفحة الرئيسية للمعلم";
    return rejectWithValue(msg);
  }
});

// === Parent Home Thunk ===
export const fetchParentHome = createAsyncThunk<
  ParentHomeResponse,
  void,
  { rejectValue: string }
>("home/fetchParentHome", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<ParentHomeResponse>(
      "/api/Client/Home/ParentHome"
    );
    return res.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "حدث خطأ أثناء جلب بيانات الصفحة الرئيسية لولي الأمر";
    return rejectWithValue(msg);
  }
});
