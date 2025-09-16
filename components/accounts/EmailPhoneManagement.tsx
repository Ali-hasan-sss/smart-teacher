"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import {
  requestChangeEmail,
  confirmChangeEmail,
} from "@/store/account/accountThunks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EmailManagementProps {
  user: any;
}

export default function EmailManagement({ user }: EmailManagementProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { changeEmailLoading, confirmEmailLoading } = useSelector(
    (state: RootState) => state.account
  );

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
    code: "",
    step: "request", // "request" or "confirm"
  });

  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleRequestEmailChange = async () => {
    if (!emailData.newEmail || !emailData.password) {
      toast.error(t("profile.enter_all_fields"));
      return;
    }

    try {
      await dispatch(
        requestChangeEmail({
          newEmail: emailData.newEmail,
          password: emailData.password,
        })
      ).unwrap();

      setEmailData((prev) => ({ ...prev, step: "confirm" }));
      toast.success(t("profile.email_code_sent"));
    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error || t("profile.error_occurred");
      if (
        errorMessage.includes("already exist") ||
        errorMessage.includes("موجود بالفعل")
      ) {
        toast.error(t("profile.email_already_exists"));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleConfirmEmailChange = async () => {
    if (!emailData.newEmail || !emailData.code) {
      toast.error(t("profile.enter_verification_code"));
      return;
    }

    try {
      await dispatch(
        confirmChangeEmail({
          newEmail: emailData.newEmail,
          code: emailData.code,
        })
      ).unwrap();

      toast.success(t("profile.email_changed_successfully"));
      setEmailData({ newEmail: "", password: "", code: "", step: "request" });
      setShowEmailForm(false);
    } catch (error: any) {
      // Handle specific error messages
      const errorMessage = error || t("profile.error_occurred");
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("غير صحيح")
      ) {
        toast.error(t("profile.invalid_verification_code"));
      } else if (
        errorMessage.includes("expired") ||
        errorMessage.includes("انتهت")
      ) {
        toast.error(t("profile.verification_code_expired"));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Email Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t("profile.change_email")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>{t("profile.current_email")}:</strong> {user?.email}
            </p>
          </div>

          {!showEmailForm ? (
            <Button
              onClick={() => setShowEmailForm(true)}
              variant="outline"
              className="w-full"
            >
              {t("profile.change_email")}
            </Button>
          ) : emailData.step === "request" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="newEmail">{t("profile.new_email")}</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      newEmail: e.target.value,
                    }))
                  }
                  placeholder={t("profile.enter_new_email")}
                />
              </div>
              <div>
                <Label htmlFor="emailPassword">
                  {t("profile.current_password")}
                </Label>
                <Input
                  id="emailPassword"
                  type="password"
                  value={emailData.password}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder={t("profile.enter_password")}
                />
              </div>
              <Button
                onClick={handleRequestEmailChange}
                disabled={changeEmailLoading}
                className="w-full flex items-center gap-2"
              >
                {changeEmailLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                {t("profile.send_verification_code")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t("profile.verification_code_sent_to")} {emailData.newEmail}
                </p>
              </div>

              {/* Verification Code Input - Similar to ResetPasswordForm */}
              <div className="flex flex-col items-center">
                <Label className="mb-2">{t("profile.verification_code")}</Label>
                <div className="flex gap-3 justify-center" dir="ltr">
                  {[0, 1, 2, 3].map((i) => (
                    <Input
                      key={i}
                      id={`emailCode-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-bold"
                      value={emailData.code[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const newCode = emailData.code.split("");

                        // إذا المستخدم لصق أكثر من رقم
                        if (val.length > 1) {
                          const chars = val.slice(0, 4).split("");
                          chars.forEach((c, idx) => {
                            if (i + idx < 4) newCode[i + idx] = c;
                          });
                          setEmailData((prev) => ({
                            ...prev,
                            code: newCode.join(""),
                          }));
                          const next = document.getElementById(
                            `emailCode-${Math.min(i + val.length, 3)}`
                          );
                          next?.focus();
                        } else {
                          newCode[i] = val;
                          setEmailData((prev) => ({
                            ...prev,
                            code: newCode.join(""),
                          }));
                          if (val && i < 3) {
                            const next = document.getElementById(
                              `emailCode-${i + 1}`
                            );
                            next?.focus();
                          }
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData
                          .getData("text")
                          .replace(/[^0-9]/g, "")
                          .slice(0, 4);
                        if (!pasted) return;

                        const newCode = emailData.code.split("");
                        pasted.split("").forEach((c, idx) => {
                          if (i + idx < 4) newCode[i + idx] = c;
                        });
                        setEmailData((prev) => ({
                          ...prev,
                          code: newCode.join(""),
                        }));

                        const next = document.getElementById(
                          `emailCode-${Math.min(i + pasted.length, 3)}`
                        );
                        next?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !emailData.code[i] &&
                          i > 0
                        ) {
                          const prev = document.getElementById(
                            `emailCode-${i - 1}`
                          );
                          prev?.focus();
                        }
                      }}
                      disabled={confirmEmailLoading}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmEmailChange}
                  disabled={confirmEmailLoading}
                  className="flex-1"
                >
                  {confirmEmailLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {t("profile.confirm_change")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailData({
                      newEmail: "",
                      password: "",
                      code: "",
                      step: "request",
                    });
                    setShowEmailForm(false);
                  }}
                  disabled={changeEmailLoading}
                >
                  {t("profile.cancel")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
