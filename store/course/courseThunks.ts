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
>("course/fetchCourses", async (params) => {
  const response = await axios.get<CourseResponse>(
    "/api/Client/Course?IncludeBookmark=true&",
    {
      params,
      headers: {
        "Accept-Language": "en",
      },
    }
  );
  return response.data;
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
