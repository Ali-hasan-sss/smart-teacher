// src/store/bookmark/bookmarkSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBookmarks, addBookmark, removeBookmark } from "./bookmarkThunks";
import { Bookmark } from "@/types/bookmark";

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
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
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        // افترضنا أن action.payload يحتوي على العلامة المضافة
        state.bookmarks.push(action.payload);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // حذف علامة
      .addCase(removeBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeBookmark.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.bookmarks = state.bookmarks.filter(
            (bookmark) => bookmark.id !== action.payload
          );
        }
      )
      .addCase(removeBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookmarkSlice.reducer;
