import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as thunks from "./accountThunks";

interface AccountState {
  user: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  qrCode?: string | null;
  parents?: any[];
  children?: any[];
  qrId?: string | null;
  // Loading states for different actions
  qrLoading?: boolean;
  parentsLoading?: boolean;
  childrenLoading?: boolean;
  addParentChildLoading?: boolean;
  removeParentChildLoading?: boolean;
  changeEmailLoading?: boolean;
  confirmEmailLoading?: boolean;
  changePhoneLoading?: boolean;
  confirmPhoneLoading?: boolean;
  updateProfileLoading?: boolean;
  changePasswordLoading?: boolean;
}

const initialState: AccountState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
  qrCode: null,
  parents: [],
  children: [],
  qrId: null,
  qrLoading: false,
  parentsLoading: false,
  childrenLoading: false,
  addParentChildLoading: false,
  removeParentChildLoading: false,
  changeEmailLoading: false,
  confirmEmailLoading: false,
  changePhoneLoading: false,
  confirmPhoneLoading: false,
  updateProfileLoading: false,
  changePasswordLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.successMessage = null;
      state.qrCode = null;
      state.parents = [];
      state.children = [];
      state.qrId = null;
      state.qrLoading = false;
      state.parentsLoading = false;
      state.childrenLoading = false;
      state.addParentChildLoading = false;
      state.removeParentChildLoading = false;
      state.changeEmailLoading = false;
      state.confirmEmailLoading = false;
      state.changePhoneLoading = false;
      state.confirmPhoneLoading = false;
      state.updateProfileLoading = false;
      state.changePasswordLoading = false;
    },
  },
  extraReducers: (builder) => {
    // getAccount
    builder
      .addCase(thunks.getAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.getAccount.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.user = action.payload.data;
          // لا نعرض توست للجلب
        }
      )
      .addCase(thunks.getAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteAccount
      .addCase(thunks.deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(thunks.deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.successMessage = "account_deleted_successfully";
      })
      .addCase(thunks.deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // verifyEmail
      .addCase(thunks.verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.verifyEmail.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage =
            action.payload.message || "تم تأكيد البريد بنجاح";
        }
      )
      .addCase(thunks.verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // resendEmailVerification
      .addCase(thunks.resendEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.resendEmailVerification.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage =
            action.payload.message || "تم إعادة إرسال كود التحقق";
        }
      )
      .addCase(thunks.resendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // forgetPassword
      .addCase(thunks.forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.forgetPassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage =
            action.payload.message || "تم إرسال تعليمات استعادة كلمة المرور";
        }
      )
      .addCase(thunks.forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // confirmForgetPassword
      .addCase(thunks.confirmForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.confirmForgetPassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.successMessage =
            action.payload.message || "تم تأكيد تغيير كلمة المرور";
        }
      )
      .addCase(thunks.confirmForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // generateRegisterQR
      .addCase(thunks.generateRegisterQR.pending, (state) => {
        state.qrLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.generateRegisterQR.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.qrLoading = false;
          state.qrCode = action.payload.data.qrCode;
          state.qrId = action.payload.data.uid;
          state.successMessage = "qr_generated_successfully";
        }
      )
      .addCase(thunks.generateRegisterQR.rejected, (state, action) => {
        state.qrLoading = false;
        state.error = action.payload as string;
      })

      // getParentAccounts
      .addCase(thunks.getParentAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        thunks.getParentAccounts.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.parents = action.payload.data;
          // لا نعرض توست للجلب
        }
      )
      .addCase(thunks.getParentAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getParents
      .addCase(thunks.getParents.pending, (state) => {
        state.parentsLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.getParents.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.parentsLoading = false;
          state.parents = action.payload.data;
          // لا نعرض توست للجلب
        }
      )
      .addCase(thunks.getParents.rejected, (state, action) => {
        state.parentsLoading = false;
        state.error = action.payload as string;
      })

      // addParentChild
      .addCase(thunks.addParentChild.pending, (state) => {
        state.addParentChildLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.addParentChild.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.addParentChildLoading = false;
          state.successMessage = "child_added_successfully";
        }
      )
      .addCase(thunks.addParentChild.rejected, (state, action) => {
        state.addParentChildLoading = false;
        state.error = action.payload as string;
      })

      // getChildren
      .addCase(thunks.getChildren.pending, (state) => {
        state.childrenLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.getChildren.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.childrenLoading = false;
          state.children = action.payload.data;
          // لا نعرض توست للجلب
        }
      )
      .addCase(thunks.getChildren.rejected, (state, action) => {
        state.childrenLoading = false;
        state.error = action.payload as string;
      })

      // removeParentChild
      .addCase(thunks.removeParentChild.pending, (state) => {
        state.removeParentChildLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.removeParentChild.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.removeParentChildLoading = false;
          state.successMessage = "child_removed_successfully";
        }
      )
      .addCase(thunks.removeParentChild.rejected, (state, action) => {
        state.removeParentChildLoading = false;
        state.error = action.payload as string;
      })

      // requestChangeEmail
      .addCase(thunks.requestChangeEmail.pending, (state) => {
        state.changeEmailLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.requestChangeEmail.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.changeEmailLoading = false;
          state.successMessage = "verification_code_sent";
        }
      )
      .addCase(thunks.requestChangeEmail.rejected, (state, action) => {
        state.changeEmailLoading = false;
        state.error = action.payload as string;
      })

      // confirmChangeEmail
      .addCase(thunks.confirmChangeEmail.pending, (state) => {
        state.confirmEmailLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.confirmChangeEmail.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.confirmEmailLoading = false;
          state.successMessage = "email_changed_successfully";
          // Update user email in state if user exists
          if (state.user) {
            state.user.email = action.payload.newEmail || state.user.email;
          }
        }
      )
      .addCase(thunks.confirmChangeEmail.rejected, (state, action) => {
        state.confirmEmailLoading = false;
        state.error = action.payload as string;
      })

      // requestChangePhone
      .addCase(thunks.requestChangePhone.pending, (state) => {
        state.changePhoneLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.requestChangePhone.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.changePhoneLoading = false;
          state.successMessage = "verification_code_sent";
        }
      )
      .addCase(thunks.requestChangePhone.rejected, (state, action) => {
        state.changePhoneLoading = false;
        state.error = action.payload as string;
      })

      // confirmChangePhone
      .addCase(thunks.confirmChangePhone.pending, (state) => {
        state.confirmPhoneLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.confirmChangePhone.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.confirmPhoneLoading = false;
          state.successMessage = "phone_changed_successfully";
          // Update user phone in state if user exists
          if (state.user) {
            state.user.phoneNumber =
              action.payload.newPhone || state.user.phoneNumber;
          }
        }
      )
      .addCase(thunks.confirmChangePhone.rejected, (state, action) => {
        state.confirmPhoneLoading = false;
        state.error = action.payload as string;
      })

      // updateAccount
      .addCase(thunks.updateAccount.pending, (state) => {
        state.updateProfileLoading = true;
        state.error = null;
      })
      .addCase(
        thunks.updateAccount.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.updateProfileLoading = false;
          // تحديث البيانات جزئياً بدلاً من الاستبدال الكامل
          if (state.user) {
            state.user = {
              ...state.user,
              ...action.payload,
              // الحفاظ على البيانات المهمة التي قد لا تأتي من API
              accountType: state.user.accountType,
              id: state.user.id,
              email: action.payload.email || state.user.email,
            };
          } else {
            state.user = action.payload;
          }
          state.successMessage = "profile_updated_successfully";
        }
      )
      .addCase(thunks.updateAccount.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.error = action.payload as string;
      })

      // changePassword
      .addCase(thunks.changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.error = null;
      })
      .addCase(thunks.changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.successMessage = "password_changed_successfully";
      })
      .addCase(thunks.changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, logout } = accountSlice.actions;
export default accountSlice.reducer;
