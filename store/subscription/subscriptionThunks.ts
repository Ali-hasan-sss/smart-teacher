import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

export const verifyCoupon = createAsyncThunk(
  "subscription/verifyCoupon",
  async (
    { code }: { code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/Client/Coupon/Verify", {
        code,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (
    {
      gradeId,
      planId,
      offerId,
      sessionId,
      notes,
      couponCode,
    }: {
      gradeId: number;
      planId: number;
      offerId?: number;
      sessionId: string;
      notes?: string;
      couponCode?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const requestBody: {
        gradeId: number;
        planId: number;
        offerId?: number;
        sessionId: string;
        notes?: string;
        couponCode?: string;
      } = {
        gradeId,
        planId,
        sessionId,
      };

      if (offerId !== undefined) {
        requestBody.offerId = offerId;
      }
      if (notes !== undefined) {
        requestBody.notes = notes;
      }
      if (couponCode !== undefined && couponCode !== "") {
        requestBody.couponCode = couponCode;
      }

      const response = await axios.post("/api/Client/Subscription", requestBody);
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

export const createSubscriptionForChild = createAsyncThunk(
  "subscription/createForChild",
  async (
    {
      gradeId,
      planId,
      offerId,
      sessionId,
      notes,
      couponCode,
      accountId,
    }: {
      gradeId: number;
      planId: number;
      offerId?: number;
      sessionId: string;
      notes: string;
      couponCode?: string;
      accountId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const requestBody: {
        gradeId: number;
        planId: number;
        offerId?: number;
        sessionId: string;
        notes: string;
        couponCode?: string;
        accountId: number;
      } = {
        gradeId,
        planId,
        sessionId,
        notes,
        accountId,
      };

      if (offerId !== undefined) {
        requestBody.offerId = offerId;
      }
      if (couponCode !== undefined && couponCode !== "") {
        requestBody.couponCode = couponCode;
      }

      const response = await axios.post("/api/Client/Subscription/ForChild", requestBody);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
