// src/store/course/courseThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import type { CourseResponse, SingleCourseResponse } from "@/types/course";

interface FetchCoursesParams {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
  subjectId?: number;
  includeBookmark?: boolean;
  accountId?: number;
}

export const fetchCourses = createAsyncThunk<
  CourseResponse,
  FetchCoursesParams
>("course/fetchCourses", async (params, thunkAPI) => {
  try {
    const response = await axios.get(
      "/api/Client/Course?IncludeBookmark=true",
      {
        params,
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "حدث خطأ ما"
    );
  }
});

export const fetchCourseById = createAsyncThunk<SingleCourseResponse, number>(
  "course/fetchCourseById",
  async (id) => {
    const response = await axios.get<SingleCourseResponse>(
      `/api/Client/Course/${id}`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    return response.data;
  }
);
