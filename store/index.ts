// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import tempAuthReducer from "./auth/tempAuthSlice";
import bookmarkReducer from "./bookmark/bookmarkSlice";
import gradesReducer from "./grade/gradeSlice";
import courseReducer from "./course/courseSlice";
import accountReducer from "./account/accountSlice";
import homeReducer from "./home/homeSlice";
import subjectReducer from "./subject/subjectSlice";
import conversationReducer from "./conversation/conversationSlice";
import subscriptionReducer from "./subscription/subscriptionSlice";
import notificationsReducer from "./notifications/notificationSlice";
import { fetchSubscriptions } from "./subscription/subscriptionThunks";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tempAuth: tempAuthReducer,
    bookmark: bookmarkReducer,
    grades: gradesReducer,
    course: courseReducer,
    account: accountReducer,
    home: homeReducer,
    subjects: subjectReducer,
    conversation: conversationReducer,
    subscription: subscriptionReducer,
    notifications: notificationsReducer,
  },
});

store.dispatch(fetchSubscriptions());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
