// src/store/slices/subjectSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchSubjects } from "./subjectThunk";

interface Subject {
  title: string;
  description: string;
  coursesCount: number;
  image: string;
  pdfFile: string;
  gradeId: number;
  id: number;
  grade: {
    title: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SubjectState {
  items: Subject[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  items: [],
  totalPages: 0,
  loading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subjectSlice.reducer;
