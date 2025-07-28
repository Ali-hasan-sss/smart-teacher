// src/store/bookmark/bookmarkThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { Bookmark, BookmarkResponse } from "@/types/bookmark";

export const fetchBookmarks = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: string }
>("bookmark/fetchBookmarks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<BookmarkResponse>(
      "/api/Client/Bookmark/Bookmarks"
    );
    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data.items;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addBookmark = createAsyncThunk(
  "bookmark/addBookmark",
  async (bookmarkData: { courseId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Bookmark/Add",
        bookmarkData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmark/removeBookmark",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/Client/Bookmark/Remove/${courseId}`
      );
      return { courseId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
