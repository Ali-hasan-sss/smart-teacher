"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";
import {
  resendEmailVerification,
  verifyEmail,
} from "@/store/account/accountThunks";
import { login } from "@/store/auth/authThunks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function VerificationForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const { email, password } = useSelector((state: RootState) => state.tempAuth);

  const handleVerify = async () => {
    if (resetCode.length !== 4) {
      setError(t("auth.enterVerificationCode"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await dispatch(
        verifyEmail({ email, code: resetCode })
      ).unwrap();

      if (result) {
        await dispatch(
          login({ email, password, methodType: "basic" })
        ).unwrap();

        window.location.replace("/");
      }
    } catch (err: any) {
      setError(err?.message || "رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError("");
      await dispatch(resendEmailVerification(email)).unwrap();
    } catch (err: any) {
      setError(err?.message || "تعذر إعادة إرسال الرمز");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4 p-2   bg-secondary py-48 ">
      <h2 className="text-2xl font-semibold text-center mb-2">
        {t("auth.enterVerificationCode")}
      </h2>

      <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 text-center break-words">
        {t("auth.verificationCodeSent")}{" "}
        <strong className="break-all">{email}</strong>
      </p>

      {/* رمز التحقق */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center mb-4" dir="ltr">
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
                    const next = document.getElementById(`resetCode-${i + 1}`);
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
                  const prev = document.getElementById(`resetCode-${i - 1}`);
                  prev?.focus();
                }
              }}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {error && <div className="text-sm text-center text-red-500">{error}</div>}

      <div className="flex flex-col gap-2 items-center">
        <Button
          onClick={handleVerify}
          disabled={loading}
          className="w-full md:w-1/4 flex items-center bg-green-700 hover:bg-green-600 text-white justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("auth.verify")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={resending}
          className="w-full md:w-1/4 flex items-center justify-center gap-2"
        >
          {resending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {t("auth.resendCode")}
        </Button>
      </div>
    </div>
  );
}
