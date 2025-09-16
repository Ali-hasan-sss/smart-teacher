import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  fetchUnseenCount,
  postUnseenCount,
  markNotificationAsSeen,
} from "./notificationThunks";

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unseenCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unseenCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // خيار إضافي لو بدك تعيين الكل كمقروء بدون API
    markAllAsReadLocally: (state) => {
      state.unseenCount = 0;
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        state.notifications = action.payload;
      }
    );
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchUnseenCount
    builder.addCase(
      fetchUnseenCount.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.unseenCount = action.payload;
      }
    );

    // markNotificationAsSeen (مفرد)
    builder.addCase(
      markNotificationAsSeen.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        );
        state.unseenCount = Math.max(state.unseenCount - 1, 0);
      }
    );

    // postUnseenCount
    builder.addCase(
      postUnseenCount.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.unseenCount = action.payload;
      }
    );
  },
});

export const { markAllAsReadLocally } = notificationSlice.actions;
export default notificationSlice.reducer;
