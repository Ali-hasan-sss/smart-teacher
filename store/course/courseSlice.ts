// src/store/course/courseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCourses, fetchCourseById, markActivition } from "./courseThunks";
import { Course, CourseResponse } from "@/types/course";

interface CourseState {
  courses: Course[];
  totalPages: number;
  course: Course | null;
  selectedCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  totalPages: 1,
  course: null,
  selectedCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearSelectedCourse(state: CourseState) {
      state.selectedCourse = null;
    },
    setCourses(state: CourseState, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<CourseResponse>) => {
          state.loading = false;
          if (action.payload.isSuccess) {
            state.courses = action.payload.data.items;
            state.totalPages = action.payload.data.totalPages;
            state.error = null;
          } else {
            state.error = action.payload.message || "Failed to fetch courses";
          }
        }
      )
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch courses";
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourseById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          if (action.payload.isSuccess) {
            state.selectedCourse = action.payload.data;
          } else {
            state.error = action.payload.message || "Failed to fetch course";
          }
        }
      )
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch course";
      });
  },
});

export const { clearSelectedCourse, setCourses } = courseSlice.actions;
export default courseSlice.reducer;
