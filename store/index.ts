// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import bookmarkReducer from "./bookmark/bookmarkSlice";
import courseReducer from "./course/courseSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmark: bookmarkReducer,
    course: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
