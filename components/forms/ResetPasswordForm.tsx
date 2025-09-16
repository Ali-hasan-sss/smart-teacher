"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { confirmForgetPassword } from "@/store/account/accountThunks";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  loading: boolean;
}

export default function ResetPasswordForm({
  open,
  setOpen,
  email,
  loading,
}: Props) {
  const { t } = useTranslation();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const dispatch = useAppDispatch();

  const handleConfirmReset = async () => {
    setResetError("");

    if (resetCode.length !== 4) {
      setResetError(t("verification.codeLength"));
      return;
    }
    if (newPassword.length < 8) {
      setResetError(t("verification.passwordLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError(t("verification.passwordMismatch"));
      return;
    }

    const resultAction = await dispatch(
      confirmForgetPassword({
        email,
        newPassword,
        code: resetCode,
      })
    );

    if (confirmForgetPassword.fulfilled.match(resultAction)) {
      setOpen(false);
    } else if (confirmForgetPassword.rejected.match(resultAction)) {
      const message = resultAction.payload || "فشل تغيير كلمة المرور";
      setResetError(message as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-third">
        <DialogHeader>
          <DialogTitle className="text-center">
            إعادة تعيين كلمة المرور
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* رمز التحقق */}
          <div className="flex flex-col items-center">
            <Label className="mb-2">رمز التحقق</Label>
            <div className="flex gap-3 justify-center" dir="ltr">
              {[0, 1, 2, 3].map((i) => (
                <Input
                  key={i}
                  id={`resetCode-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-bold"
                  value={resetCode[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    const newCode = resetCode.split("");

                    // إذا المستخدم لصق أكثر من رقم
                    if (val.length > 1) {
                      const chars = val.slice(0, 4).split("");
                      chars.forEach((c, idx) => {
                        if (i + idx < 4) newCode[i + idx] = c;
                      });
                      setResetCode(newCode.join(""));
                      const next = document.getElementById(
                        `resetCode-${Math.min(i + val.length, 3)}`
                      );
                      next?.focus();
                    } else {
                      newCode[i] = val;
                      setResetCode(newCode.join(""));
                      if (val && i < 3) {
                        const next = document.getElementById(
                          `resetCode-${i + 1}`
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

                    const newCode = resetCode.split("");
                    pasted.split("").forEach((c, idx) => {
                      if (i + idx < 4) newCode[i + idx] = c;
                    });
                    setResetCode(newCode.join(""));

                    const next = document.getElementById(
                      `resetCode-${Math.min(i + pasted.length, 3)}`
                    );
                    next?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !resetCode[i] && i > 0) {
                      const prev = document.getElementById(
                        `resetCode-${i - 1}`
                      );
                      prev?.focus();
                    }
                  }}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* كلمة المرور الجديدة */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={loading}
            />
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              disabled={loading}
            />
          </div>

          {resetError && (
            <div className="text-sm text-center text-red-500">{resetError}</div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleConfirmReset}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white"
          >
            {loading ? "..." : "تأكيد تغيير كلمة المرور"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
