import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

export const verifyCoupon = createAsyncThunk(
  "subscription/verifyCoupon",
  async ({ code }: { code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/Client/Coupon/Verify", {
        code,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
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
      sessionId?: string;
      notes?: string;
      couponCode?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const requestBody: {
        gradeId: number;
        planId: number;
        offerId?: number;
        sessionId?: string;
        notes?: string;
        couponCode?: string;
      } = {
        gradeId,
        planId,
      };

      if (offerId !== undefined && offerId !== 0) {
        requestBody.offerId = offerId;
      }
      if (sessionId !== undefined && sessionId !== "") {
        requestBody.sessionId = sessionId;
      }
      if (notes !== undefined && notes !== "") {
        requestBody.notes = notes;
      }
      if (couponCode !== undefined && couponCode !== "") {
        requestBody.couponCode = couponCode;
      }

      const response = await axios.post(
        "/api/Client/Subscription",
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
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
  },
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
  },
);

export const fetchFamilyPlans = createAsyncThunk(
  "subscription/fetchFamilyPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Plan/Family");
      return (
        response.data.data?.items ?? response.data.data ?? response.data ?? []
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchSubjectBasedPlans = createAsyncThunk(
  "subscription/fetchSubjectBasedPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Plan/SubjectBased");
      return (
        response.data.data?.items ?? response.data.data ?? response.data ?? []
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchTeacherPlans = createAsyncThunk(
  "subscription/fetchTeacherPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/Client/Plan/Teacher");
      return (
        response.data.data?.items ?? response.data.data ?? response.data ?? []
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
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
      sessionId?: string;
      notes: string;
      couponCode?: string;
      accountId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const requestBody: {
        gradeId: number;
        planId: number;
        offerId?: number;
        sessionId?: string;
        notes: string;
        couponCode?: string;
        accountId: number;
      } = {
        gradeId,
        planId,
        notes,
        accountId,
      };

      if (offerId !== undefined && offerId !== 0) {
        requestBody.offerId = offerId;
      }
      if (sessionId !== undefined && sessionId !== "") {
        requestBody.sessionId = sessionId;
      }
      if (couponCode !== undefined && couponCode !== "") {
        requestBody.couponCode = couponCode;
      }

      const response = await axios.post(
        "/api/Client/Subscription/ForChild",
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createSubjectBasedSubscription = createAsyncThunk(
  "subscription/createSubjectBased",
  async (
    {
      planId,
      subjectId,
      offerId,
      sessionId,
      notes,
      couponCode,
    }: {
      planId: number;
      subjectId: number;
      offerId?: number;
      sessionId?: string;
      notes?: string;
      couponCode?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const requestBody: {
        planId: number;
        subjectId: number;
        offerId?: number;
        sessionId?: string;
        notes?: string;
        couponCode?: string;
      } = { planId, subjectId };

      if (offerId !== undefined && offerId !== 0) requestBody.offerId = offerId;
      if (sessionId !== undefined && sessionId !== "")
        requestBody.sessionId = sessionId;
      if (notes !== undefined && notes !== "") requestBody.notes = notes;
      if (couponCode !== undefined && couponCode !== "")
        requestBody.couponCode = couponCode;

      const response = await axios.post(
        "/api/Client/Subscription/SubjectBased",
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createFamilySubscription = createAsyncThunk(
  "subscription/createFamily",
  async (
    {
      planId,
      childAccountIds,
      offerId,
      sessionId,
      notes,
      couponCode,
    }: {
      planId: number;
      childAccountIds: number[];
      offerId?: number;
      sessionId?: string;
      notes?: string;
      couponCode?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const requestBody: {
        planId: number;
        childAccountIds: number[];
        offerId?: number;
        sessionId?: string;
        notes?: string;
        couponCode?: string;
      } = { planId, childAccountIds };

      if (offerId !== undefined && offerId !== 0) requestBody.offerId = offerId;
      if (sessionId !== undefined && sessionId !== "")
        requestBody.sessionId = sessionId;
      if (notes !== undefined && notes !== "") requestBody.notes = notes;
      if (couponCode !== undefined && couponCode !== "")
        requestBody.couponCode = couponCode;

      const response = await axios.post(
        "/api/Client/Subscription/Family",
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createTeacherSubscription = createAsyncThunk(
  "subscription/createTeacher",
  async (
    {
      planId,
      gradeIds,
      offerId,
      sessionId,
      notes,
      couponCode,
    }: {
      planId: number;
      gradeIds: number[];
      offerId?: number;
      sessionId?: string;
      notes?: string;
      couponCode?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const requestBody: {
        planId: number;
        gradeIds: number[];
        offerId?: number;
        sessionId?: string;
        notes?: string;
        couponCode?: string;
      } = { planId, gradeIds };

      if (offerId !== undefined && offerId !== 0) requestBody.offerId = offerId;
      if (sessionId !== undefined && sessionId !== "")
        requestBody.sessionId = sessionId;
      if (notes !== undefined && notes !== "") requestBody.notes = notes;
      if (couponCode !== undefined && couponCode !== "")
        requestBody.couponCode = couponCode;

      const response = await axios.post(
        "/api/Client/Subscription/Teacher",
        requestBody,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
