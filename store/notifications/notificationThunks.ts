import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/Client/Notification/Notifications"
      );
      return response.data.data.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnseenCount = createAsyncThunk(
  "notifications/fetchUnseenCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/Client/Notification/UnSeenNotificationsCount"
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch unseen count"
      );
    }
  }
);

export const markNotificationAsSeen = createAsyncThunk(
  "notifications/markAsSeen",
  async (notificationUId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/Client/Notification/SetNotificationSeen/${notificationUId}`
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark notification as seen"
      );
    }
  }
);

export const postUnseenCount = createAsyncThunk(
  "notifications/postUnseenCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/Client/Notification/SetAllNotificationsSeen"
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to post unseen count"
      );
    }
  }
);
