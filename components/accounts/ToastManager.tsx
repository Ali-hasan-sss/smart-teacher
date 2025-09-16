"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { clearError, clearSuccess } from "@/store/account/accountSlice";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function ToastManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    successMessage,
    error,
    updateProfileLoading,
    changePasswordLoading,
    changeEmailLoading,
    confirmEmailLoading,
    changePhoneLoading,
    confirmPhoneLoading,
    addParentChildLoading,
    removeParentChildLoading,
    qrLoading,
  } = useSelector((state: RootState) => state.account);

  // Handle success messages
  useEffect(() => {
    if (successMessage) {
      // Check if it's a translation key or direct message
      let title = successMessage;
      let description = "";

      // If it's a translation key, get the translation
      if (successMessage.includes("_")) {
        title = t(`subscriptions.${successMessage}`);
        description = t(`subscriptions.${successMessage}`);
      } else {
        // For direct messages, determine the type based on content
        if (
          successMessage.includes("password") ||
          successMessage.includes("كلمة المرور")
        ) {
          title = t("subscriptions.passwordChanged");
        } else if (
          successMessage.includes("email") ||
          successMessage.includes("بريد")
        ) {
          title = t("subscriptions.emailChanged");
        } else if (
          successMessage.includes("phone") ||
          successMessage.includes("هاتف")
        ) {
          title = t("subscriptions.phoneChanged");
        } else if (
          successMessage.includes("child") ||
          successMessage.includes("طفل")
        ) {
          title = t("subscriptions.childAdded");
        } else if (
          successMessage.includes("parent") ||
          successMessage.includes("والد")
        ) {
          title = t("subscriptions.parentAdded");
        } else if (
          successMessage.includes("QR") ||
          successMessage.includes("رمز")
        ) {
          title = t("subscriptions.qrGenerated");
        } else if (
          successMessage.includes("verification") ||
          successMessage.includes("تحقق")
        ) {
          title = t("subscriptions.verification_code_sent");
        } else if (
          successMessage.includes("delete") ||
          successMessage.includes("حذف")
        ) {
          title = t("subscriptions.accountDeleted");
        } else {
          title = t("subscriptions.profileUpdated");
        }
        description = successMessage;
      }

      toast({
        title: title,
        description: description || title,
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
      });

      // Clear success message after showing toast
      dispatch(clearSuccess());
    }
  }, [successMessage, dispatch, toast, t]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      // Determine the type of error message based on loading states
      let title = t("subscriptions.profileUpdateFailed");
      let description = error;

      if (updateProfileLoading === false && error.includes("profile")) {
        title = t("subscriptions.profileUpdateFailed");
      } else if (
        changePasswordLoading === false &&
        (error.includes("password") || error.includes("كلمة المرور"))
      ) {
        title = t("subscriptions.passwordChangeFailed");
      } else if (
        changeEmailLoading === false &&
        (error.includes("email") || error.includes("بريد"))
      ) {
        title = t("subscriptions.emailChangeFailed");
      } else if (
        changePhoneLoading === false &&
        (error.includes("phone") || error.includes("هاتف"))
      ) {
        title = t("subscriptions.phoneChangeFailed");
      } else if (
        addParentChildLoading === false &&
        (error.includes("child") || error.includes("طفل"))
      ) {
        title = t("subscriptions.childAddFailed");
      } else if (
        removeParentChildLoading === false &&
        (error.includes("remove") || error.includes("إزالة"))
      ) {
        title = t("subscriptions.childRemoveFailed");
      } else if (
        qrLoading === false &&
        (error.includes("QR") || error.includes("رمز"))
      ) {
        title = t("subscriptions.qrGenerateFailed");
      } else if (error.includes("delete") || error.includes("حذف")) {
        title = t("subscriptions.accountDeleteFailed");
      }

      toast({
        title: title,
        description: description,
        className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
      });

      // Clear error after showing toast
      dispatch(clearError());
    }
  }, [
    error,
    dispatch,
    toast,
    t,
    updateProfileLoading,
    changePasswordLoading,
    changeEmailLoading,
    confirmEmailLoading,
    changePhoneLoading,
    confirmPhoneLoading,
    addParentChildLoading,
    removeParentChildLoading,
    qrLoading,
  ]);

  return null; // This component doesn't render anything
}
