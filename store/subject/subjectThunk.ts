// src/store/thunks/subjectThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface FetchSubjectsParams {
  gradeId: number;
  pageNumber?: number;
  pageSize?: number;
  title?: string;
}
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (params: FetchSubjectsParams, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Subject", {
        params: {
          GradetId: params.gradeId,
          PageNumber: params.pageNumber || 1,
          PageSize: params.pageSize || 10,
          Title: params.title || "",
        },
      });

      const { items, totalPages } = response.data.data;

      return { items, totalPages };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "حدث خطأ ما");
    }
  }
);
