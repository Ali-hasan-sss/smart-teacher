import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGradesWithPagination, fetchAllGrades } from "./gradeThunk";
import { Grade } from "@/types/grade";

interface GradesState {
  grades: Grade[];
  paginatedGrades: Grade[];
  loading: boolean;
  error: string | null;
}

const initialState: GradesState = {
  grades: [],
  paginatedGrades: [],
  loading: false,
  error: null,
};

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch with pagination
    builder
      .addCase(fetchGradesWithPagination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGradesWithPagination.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.paginatedGrades = action.payload?.data?.items || [];
        }
      )
      .addCase(fetchGradesWithPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all grades
    builder
      .addCase(fetchAllGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllGrades.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.grades = action.payload?.data?.items || [];
        }
      )
      .addCase(fetchAllGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default gradesSlice.reducer;
