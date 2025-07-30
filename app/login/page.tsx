"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/auth/authThunks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { setUser } from "@/store/auth/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const loading = auth.loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("auth.fillAllFields"));
      return;
    }

    if (!email.includes("@")) {
      setError(t("auth.invalidEmail"));
      return;
    }

    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      router.push("/");
    } else if (login.rejected.match(resultAction)) {
      const message = resultAction.payload || "فشل تسجيل الدخول";
      setError(message as string);
    }
  };

  return (
    <div className="min-h-screen pt-[100px]  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : t("auth.loginButton")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {t("auth.registerHere")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
