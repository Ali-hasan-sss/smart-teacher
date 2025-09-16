"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { login, register } from "@/store/auth/authThunks";
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
import GradeSelect from "@/components/forms/GradeSelect";
import { setTempAuth } from "@/store/auth/tempAuthSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterFormProps {
  defaults?: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    registerToken?: string;
  }>;
  switchTab: (tab: "login" | "register") => void;
}

export default function RegisterForm({
  defaults,
  switchTab,
}: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [methodType, setMethodType] = useState<"basic" | "google">(
    defaults && Object.keys(defaults).length > 0 ? "google" : "basic"
  );
  const [formData, setFormData] = useState({
    firstName: defaults?.firstName || "",
    lastName: defaults?.lastName || "",
    email: defaults?.email || "",
    phoneNumber: defaults?.phoneNumber || "",
    birthdate: "",
    gradeId: "1",
    password: "",
    confirmPassword: "",
    image: "",
    accountType: "client",
    registerToken: defaults?.registerToken || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const isLoading = auth.loading;
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (defaults && Object.keys(defaults).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...defaults,
        registerToken: defaults.registerToken || "",
      }));
      setMethodType("google");
    }
  }, [defaults]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError(t("auth.fillAllFields"));
      return;
    }
    if (!formData.email.includes("@")) {
      setError(t("auth.invalidEmail"));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordsDontMatch"));
      return;
    }

    const registerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      birthdate: formData.birthdate,
      gradeId: Number.parseInt(formData.gradeId),
      password: formData.password,
      image: formData.image,
      methodType: methodType,
      accountType: formData.accountType,
      registerToken: formData.registerToken,
    };

    const resultAction = await dispatch(register(registerData));

    if (register.fulfilled.match(resultAction)) {
      if (formData.registerToken) {
        // تسجيل الدخول مباشرة عند التسجيل عبر Google
        await dispatch(
          login({
            email: formData.email,
            password: formData.password,
            methodType: "basic",
          })
        );
        router.push("/");
      } else {
        dispatch(
          setTempAuth({ email: formData.email, password: formData.password })
        );
        router.push("/login/verify-email");
      }
    } else if (register.rejected.match(resultAction)) {
      const payload = resultAction.payload as
        | { message: string; code?: number }
        | undefined;
      const errorMessage =
        payload?.message ||
        resultAction.error?.message ||
        "حدث خطأ أثناء إنشاء الحساب";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-third dark:bg-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("auth.registerTitle")}
          </CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="First name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading || !!defaults?.email} // منع تعديل الايميل إذا جاء من جوجل
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t("auth.phoneNumber")}</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">{t("auth.accountType")}</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) =>
                  handleInputChange("accountType", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("auth.selectAccountType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">{t("auth.student")}</SelectItem>
                  <SelectItem value="teacher">{t("auth.teacher")}</SelectItem>
                  <SelectItem value="parent">{t("auth.parent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {formData.accountType !== "parent" && (
                <div className="space-y-2">
                  <Label htmlFor="gradeId">{t("auth.grade")}</Label>
                  <GradeSelect
                    value={parseInt(formData.gradeId)}
                    onChange={(value) =>
                      handleInputChange("gradeId", value.toString())
                    }
                    placeholder="اختر الصف الدراسي"
                    className="mb-4"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="birthdate">{t("auth.birthdate")}</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    handleInputChange("birthdate", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("auth.confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-700 text-gray-800 hover:bg-blue-600 text-white "
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : t("auth.registerButton")}
            </Button>
          </form>
          <div className="pt-3 w-full text-center">
            <button
              className="text-blue-500 px-2"
              onClick={() => switchTab("login")}
            >
              {t("auth.loginButton")}
            </button>
            <span> {t("auth.alreadyHaveAccount")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
