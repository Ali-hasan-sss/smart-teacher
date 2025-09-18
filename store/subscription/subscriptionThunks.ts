import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (
    {
      gradeId,
      planId,
      sessionId,
    }: { gradeId: number; planId: number; sessionId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/Client/Subscription", {
        gradeId,
        planId,
        sessionId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSubscriptions = createAsyncThunk(
  "subscription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Subscription");
      return response.data.data.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Plan");
      return response.data.data.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
