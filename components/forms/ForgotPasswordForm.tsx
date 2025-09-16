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
import { forgetPassword } from "@/store/account/accountThunks";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setOpenReset: (open: boolean) => void;
  forgotEmail: string;
  setForgotEmail: (email: string) => void;
}

export default function ForgotPasswordForm({
  open,
  setOpen,
  setOpenReset,
  forgotEmail,
  setForgotEmail,
}: Props) {
  const { t } = useTranslation();
  const [forgotMsg, setForgotMsg] = useState("");
  const dispatch = useAppDispatch();

  const handleForgot = async () => {
    setForgotMsg("");
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setForgotMsg(t("forgotPassword.invalidEmail"));
      return;
    }

    const resultAction = await dispatch(forgetPassword(forgotEmail));
    if (forgetPassword.fulfilled.match(resultAction)) {
      setOpen(false);
      setOpenReset(true);
    } else if (forgetPassword.rejected.match(resultAction)) {
      const message = resultAction.payload || t("forgotPassword.sendFailed");
      setForgotMsg(message as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("forgotPassword.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="forgotEmail">{t("auth.email")}</Label>
          <Input
            id="forgotEmail"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder={t("forgotPassword.emailPlaceholder")}
          />
          {forgotMsg && (
            <div className="text-sm text-center text-red-500">{forgotMsg}</div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleForgot}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white"
          >
            {t("forgotPassword.sendCode")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
