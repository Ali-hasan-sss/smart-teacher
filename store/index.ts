// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import bookmarkReducer from "./bookmark/bookmarkSlice";
import courseReducer from "./course/courseSlice";
import accountReducer from "./account/accountSlice";
import subjectReducer from "./subject/subjectSlice";
import conversationReducer from "./conversation/conversationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmark: bookmarkReducer,
    course: courseReducer,
    account: accountReducer,
    subjects: subjectReducer,
    conversation: conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
