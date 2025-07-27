// src/store/bookmark/bookmarkThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { Bookmark, BookmarkResponse } from "@/types/bookmark";

export const fetchBookmarks = createAsyncThunk<
  Bookmark[], // نوع النتيجة عند النجاح (array of Bookmark)
  void, // لا يأخذ باراميتر
  { rejectValue: string } // نوع الخطأ المرفوع
>("bookmark/fetchBookmarks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<BookmarkResponse>(
      "/api/Client/Bookmark/Bookmarks"
    );
    if (!response.data.isSuccess) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data;
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
      return response.data; // عادة تأكيد الإضافة
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
