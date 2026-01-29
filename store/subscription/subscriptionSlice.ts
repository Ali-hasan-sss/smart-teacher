import { createSlice } from "@reduxjs/toolkit";
import {
  createSubscription,
  fetchSubscriptions,
  fetchPlans,
  fetchFamilyPlans,
  fetchSubjectBasedPlans,
  fetchTeacherPlans,
  createSubscriptionForChild,
  createSubjectBasedSubscription,
  createFamilySubscription,
  createTeacherSubscription,
  verifyCoupon,
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
  /** المادة في حالة الاشتراك حسب المادة (SubjectBased) */
  subject?: { id: number; [key: string]: any } | null;
}

export interface ActiveOffer {
  id: number;
  title: string;
  discountPercentage: number;
  image: string;
  planId: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
}

export interface Plan {
  id: number;
  title: string;
  type: string;
  price: number;
  expiredAt: string;
  activeOffer?: ActiveOffer | null;
  /** عدد الأطفال المسموح به للخطة العائلية (من استجابة الخطط العائلية) */
  numberOfChildren?: number;
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
  couponVerificationLoading: boolean;
  couponVerificationError: string | null;
  verifiedCoupon: any | null;
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
  couponVerificationLoading: false,
  couponVerificationError: null,
  verifiedCoupon: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearCouponVerification: (state) => {
      state.verifiedCoupon = null;
      state.couponVerificationError = null;
    },
  },
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

    // Family plans cases (same state as plans)
    builder.addCase(fetchFamilyPlans.pending, (state) => {
      state.plansLoading = true;
      state.plansError = null;
    });
    builder.addCase(fetchFamilyPlans.fulfilled, (state, action) => {
      state.plansLoading = false;
      state.plans = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchFamilyPlans.rejected, (state, action) => {
      state.plansLoading = false;
      state.plansError = action.payload as string;
    });

    // Subject-based plans
    builder.addCase(fetchSubjectBasedPlans.pending, (state) => {
      state.plansLoading = true;
      state.plansError = null;
    });
    builder.addCase(fetchSubjectBasedPlans.fulfilled, (state, action) => {
      state.plansLoading = false;
      state.plans = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchSubjectBasedPlans.rejected, (state, action) => {
      state.plansLoading = false;
      state.plansError = action.payload as string;
    });

    // Teacher plans
    builder.addCase(fetchTeacherPlans.pending, (state) => {
      state.plansLoading = true;
      state.plansError = null;
    });
    builder.addCase(fetchTeacherPlans.fulfilled, (state, action) => {
      state.plansLoading = false;
      state.plans = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchTeacherPlans.rejected, (state, action) => {
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

    // Create subject-based subscription
    builder.addCase(createSubjectBasedSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createSubjectBasedSubscription.fulfilled,
      (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.items.push(action.payload.data);
        }
      },
    );
    builder.addCase(
      createSubjectBasedSubscription.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      },
    );

    // Create family subscription
    builder.addCase(createFamilySubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createFamilySubscription.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        const data = action.payload.data;
        state.items.push(...(Array.isArray(data) ? data : [data]));
      }
    });
    builder.addCase(createFamilySubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create teacher subscription
    builder.addCase(createTeacherSubscription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTeacherSubscription.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        const data = action.payload.data;
        state.items.push(...(Array.isArray(data) ? data : [data]));
      }
    });
    builder.addCase(createTeacherSubscription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Coupon verification cases
    builder.addCase(verifyCoupon.pending, (state) => {
      state.couponVerificationLoading = true;
      state.couponVerificationError = null;
      state.verifiedCoupon = null;
    });
    builder.addCase(verifyCoupon.fulfilled, (state, action) => {
      state.couponVerificationLoading = false;
      state.verifiedCoupon = action.payload;
    });
    builder.addCase(verifyCoupon.rejected, (state, action) => {
      state.couponVerificationLoading = false;
      state.couponVerificationError = action.payload as string;
      state.verifiedCoupon = null;
    });
  },
});

export const { clearCouponVerification } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
