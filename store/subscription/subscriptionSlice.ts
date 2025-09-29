import { createSlice } from "@reduxjs/toolkit";
import {
  createSubscription,
  fetchSubscriptions,
  fetchPlans,
  createSubscriptionForChild,
} from "./subscriptionThunks";

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

export interface Plan {
  id: number;
  title: string;
  type: string;
  price: number;
  expiredAt: string;
}

interface SubscriptionState {
  items: Subscription[];
  plans: Plan[];
  loading: boolean;
  plansLoading: boolean;
  error: string | null;
  plansError: string | null;
  forChildLoading: boolean;
  forChildError: string | null;
}

const initialState: SubscriptionState = {
  items: [],
  plans: [],
  loading: false,
  plansLoading: false,
  error: null,
  plansError: null,
  forChildLoading: false,
  forChildError: null,
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

    // Plans cases
    builder.addCase(fetchPlans.pending, (state) => {
      state.plansLoading = true;
      state.plansError = null;
    });
    builder.addCase(fetchPlans.fulfilled, (state, action) => {
      state.plansLoading = false;
      state.plans = action.payload || [];
    });
    builder.addCase(fetchPlans.rejected, (state, action) => {
      state.plansLoading = false;
      state.plansError = action.payload as string;
    });

    // Create subscription for child cases
    builder.addCase(createSubscriptionForChild.pending, (state) => {
      state.forChildLoading = true;
      state.forChildError = null;
    });
    builder.addCase(createSubscriptionForChild.fulfilled, (state, action) => {
      state.forChildLoading = false;
      if (action.payload?.data) {
        state.items.push(action.payload.data);
      }
    });
    builder.addCase(createSubscriptionForChild.rejected, (state, action) => {
      state.forChildLoading = false;
      state.forChildError = action.payload as string;
    });
  },
});

export default subscriptionSlice.reducer;
