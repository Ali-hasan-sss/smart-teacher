import { createSlice } from "@reduxjs/toolkit";
import { createSubscription, fetchSubscriptions } from "./subscriptionThunks";

interface Account {
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phoneNumber: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  birthdate: string;
  grade: {
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Subscription {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  accountId: number;
  expireAt: string;
  account: Account | null;
  grade: {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    firstSemesterPrice: number;
    secondSemesterPrice: number;
    firstSemesterExpireAt: string;
    secondSemesterExpireAt: string;
    subjects: any[];
  };
  plan: any | null;
  semester: string;
  cost: number;
  gradeId: number;
  planId: number;
  sessionId: string | null;
}

interface SubscriptionState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  items: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        state.items.push(action.payload.data);
      }
    });
    builder.addCase(createSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchSubscriptions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
    });
    builder.addCase(fetchSubscriptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default subscriptionSlice.reducer;
