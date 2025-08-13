import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

// Fetch grades with pagination
export const fetchGradesWithPagination = createAsyncThunk(
  "grades/fetchWithPagination",
  async (
    params: { PageNumber?: number; PageSize?: number; Title?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/Client/Grade", { params });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch grades with pagination"
      );
    }
  }
);

// Fetch all grades without pagination
export const fetchAllGrades = createAsyncThunk(
  "grades/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Grade/List");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch all grades"
      );
    }
  }
);
