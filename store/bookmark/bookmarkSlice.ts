// src/store/bookmark/bookmarkSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBookmarks, addBookmark, removeBookmark } from "./bookmarkThunks";
import { Bookmark } from "@/types/bookmark";

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  toggleLoading: number | null;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
  toggleLoading: null,
  error: null,
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBookmarks.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.bookmarks = action.payload;
        }
      )
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // إضافة علامة
      .addCase(addBookmark.pending, (state, action) => {
        state.toggleLoading = Number(action.meta.arg.courseId); // ← تخزين الـ ID
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.toggleLoading = null;
        state.bookmarks.push(action.payload);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.toggleLoading = null;
        state.error = action.payload as string;
      })

      // حذف علامة
      .addCase(removeBookmark.pending, (state, action) => {
        state.toggleLoading = Number(action.meta.arg);
        state.error = null;
      })
      .addCase(
        removeBookmark.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.toggleLoading = null;
          state.bookmarks = state.bookmarks.filter(
            (bookmark) => bookmark.id !== action.payload
          );
        }
      )
      .addCase(removeBookmark.rejected, (state, action) => {
        state.toggleLoading = null;
        state.error = action.payload as string;
      });
  },
});

export default bookmarkSlice.reducer;
