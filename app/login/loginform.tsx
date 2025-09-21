"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/auth/authThunks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { googleAuth, googleProvider } from "@/lib/firebase";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { Eye, EyeClosed } from "lucide-react";

interface LoginFormProps {
  switchTab: (tab: "login" | "register") => void;
  setRegisterDefaults: (
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      registerToken: string;
    }>
  ) => void;
}

export default function LoginForm({
  switchTab,
  setRegisterDefaults,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [methodType, setMethodType] = useState<"basic" | "Google">("basic");

  // modals
  const [openForgot, setOpenForgot] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const loading = auth.loading;

  // ----------- login submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMethodType("basic");

    if (!email || !password) {
      setError(t("auth.fillAllFields"));
      return;
    }
    if (!email.includes("@")) {
      setError(t("auth.invalidEmail"));
      return;
    }
    if (password.length < 8) {
      setError(
        t("auth.passwordMinLength") || "كلمة المرور يجب أن تكون أكبر من 8 أحرف"
      );
      return;
    }

    const resultAction = await dispatch(
      login({ email, password, methodType: "basic" })
    );

    if (login.fulfilled.match(resultAction)) {
      // التحقق من وجود صفحة محفوظة للعودة إليها
      if (typeof window !== "undefined") {
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.replace(redirectPath);
        } else {
          window.location.replace("/");
        }
      }
    } else if (login.rejected.match(resultAction)) {
      const payload = resultAction.payload as any;
      const message =
        typeof payload === "string"
          ? payload
          : payload?.message || "فشل تسجيل الدخول";
      setError(message);
    }
  };

  // ----------- Google login ----------
  const handleGoogleLogin = async () => {
    if (typeof window === "undefined") return;
    try {
      const result = await signInWithPopup(googleAuth, googleProvider);
      const user = result.user;

      // الحصول على idToken و oauthIdToken
      const idToken = await user.getIdToken();
      const oauthIdToken = (result as any)._tokenResponse?.oauthIdToken;
      // console.log("oauth:", oauthIdToken);
      const tokenToSend = oauthIdToken || idToken;

      const resultAction = await dispatch(
        login({
          email: user.email || "",
          password: tokenToSend,
          methodType: "google",
        })
      );

      if (login.fulfilled.match(resultAction)) {
        // التحقق من وجود صفحة محفوظة للعودة إليها
        if (typeof window !== "undefined") {
          const redirectPath = localStorage.getItem("redirectAfterLogin");
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.replace(redirectPath);
          } else {
            window.location.replace("/");
          }
        }
      } else if (login.rejected.match(resultAction)) {
        console.log("Rejected action:", resultAction);
        const payload = resultAction.payload as any;
        if (payload?.code === 404) {
          setRegisterDefaults({
            email: user.email || "",
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ")[1] || "",
            phoneNumber: user.phoneNumber || "",
            registerToken: tokenToSend,
          });

          switchTab("register");
        } else {
          setError(payload?.message || "حدث خطأ أثناء تسجيل الدخول بجوجل");
        }
      }
    } catch (error) {
      console.error("خطأ في تسجيل الدخول بجوجل:", error);
      setError("حدث خطأ أثناء تسجيل الدخول بجوجل");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-third dark:bg-gray-700 py-5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("auth.loginTitle")}
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
            </div>
            <button
              type="button"
              className="text-blue-600"
              onClick={() => setOpenForgot(true)}
            >
              {t("auth.forgotPassword")}
            </button>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-700 text-gray-800 hover:bg-blue-600 text-white "
              disabled={loading}
            >
              {loading ? "Loading..." : t("auth.loginButton")}
            </Button>
          </form>

          <div className="w-full flex items-center justify-center my-4 gap-1">
            <div className="w-1/3 h-[1px] bg-gray-700 dark:bg-gray-200"></div>
            <div className="text-gray-700 dark:text-gray-200">أو</div>
            <div className="w-1/3 h-[1px] bg-gray-800 dark:bg-gray-200"></div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleGoogleLogin}
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <Image
                src={"/images/google.png"}
                alt="google"
                width={20}
                height={20}
              />
              {t("auth.loginWithGoogle") || " التسجيل بواسطة Google"}
            </Button>
          </div>
          <div className="pt-3 w-full text-center">
            <button
              className="text-blue-500 px-2"
              onClick={() => switchTab("register")}
            >
              {t("auth.registerButton")}
            </button>
            <span>{t("auth.dontHaveAccount")}</span>
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordForm
        open={openForgot}
        setOpen={setOpenForgot}
        setOpenReset={setOpenReset}
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
      />
      <ResetPasswordForm
        open={openReset}
        setOpen={setOpenReset}
        email={forgotEmail}
        loading={loading}
      />
    </div>
  );
}
