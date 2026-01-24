"use client";

import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, CreditCard, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { socialLinks } from "@/utils/socialLimk";
import Link from "next/link";
import Image from "next/image";

export default function PaymentSuccess() {
  const router = useRouter();
  const activatedRef = useRef(false);
  const [isActivating, setIsActivating] = useState(true);
  const [activationComplete, setActivationComplete] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (activatedRef.current) return;
    activatedRef.current = true;

    const activateSubscription = async () => {
      const planId = localStorage.getItem("selectedPlanId");
      const gradeId = localStorage.getItem("selectedGradeId");
      const childId = localStorage.getItem("selectedChildId");
      const sessionId = localStorage.getItem("paymentSessionId");
      const couponCode = localStorage.getItem("couponCode");

      // مسار العودة بعد إتمام الاشتراك
      const returnPath =
        localStorage.getItem("subscriptionReturnPath") ||
        localStorage.getItem("currentPath") ||
        "/";

      if (!planId) {
        setIsActivating(false);
        toast({
          title: "فشل العملية",
          description: "بيانات الاشتراك غير مكتملة.",
        });
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // إذا لم يكن هناك sessionId، يعني أن الاشتراك تم مباشرة (السعر كان 0)
      // في هذه الحالة، لا حاجة لإرسال طلب تفعيل لأن الاشتراك تم بالفعل
      if (!sessionId) {
        setIsActivating(false);
        setActivationComplete(true);
        // تنظيف البيانات المؤقتة
        setTimeout(() => {
          [
            "selectedPlanId",
            "selectedGradeId",
            "selectedChildId",
            "subscriptionNotes",
            "paymentSessionId",
            "subscriptionGradeId",
            "subscriptionReturnPath",
            "currentPath",
            "couponCode",
          ].forEach((key) => localStorage.removeItem(key));

          router.push(returnPath || "/");
        }, 3000);
        return;
      }

      // التحقق من وجود بيانات إما الصف أو الابن
      if (!gradeId && !childId) {
        setIsActivating(false);
        toast({
          title: "فشل العملية",
          description: "لم يتم تحديد الصف أو الابن.",
        });
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      if (localStorage.getItem(`activated_${sessionId}`)) {
        setIsActivating(false);
        setActivationComplete(true);
        setTimeout(() => {
          [
            "selectedPlanId",
            "selectedGradeId",
            "selectedChildId",
            "subscriptionNotes",
            "paymentSessionId",
            "subscriptionGradeId",
            "subscriptionReturnPath",
            "currentPath",
            "couponCode",
          ].forEach((key) => localStorage.removeItem(key));

          router.push(returnPath || "/");
        }, 3000);
        return;
      }

      try {
        setIsActivating(true);

        // تحديد نوع الطلب حسب وجود childId
        if (childId) {
          // للحسابات من نوع Parent - استخدام الرابط الجديد
          const requestBody: {
            planId: number;
            gradeId: number;
            offerId?: number;
            sessionId: string;
            notes: string;
            accountId: number;
            couponCode?: string;
          } = {
            planId: +planId,
            gradeId: +gradeId! || 0, // يمكن أن يكون 0 إذا لم يتم تحديده
            sessionId,
            notes: localStorage.getItem("subscriptionNotes") || "",
            accountId: +childId,
          };

          if (couponCode) {
            requestBody.couponCode = couponCode;
          }

          await axios.post("/api/Client/Subscription/ForChild", requestBody);
        } else {
          // للحسابات العادية
          const requestBody: {
            planId: number;
            gradeId: number;
            offerId?: number;
            sessionId: string;
            notes?: string;
            couponCode?: string;
          } = {
            planId: +planId,
            gradeId: +gradeId!,
            sessionId,
          };

          if (couponCode) {
            requestBody.couponCode = couponCode;
          }

          await axios.post("/api/Client/Subscription", requestBody);
        }

        localStorage.setItem(`activated_${sessionId}`, "true");
        setIsActivating(false);
        setActivationComplete(true);

        // تنظيف البيانات المؤقتة
        setTimeout(() => {
          [
            "selectedPlanId",
            "selectedGradeId",
            "selectedChildId",
            "subscriptionNotes",
            "paymentSessionId",
            "subscriptionGradeId",
            "subscriptionReturnPath",
            "currentPath",
            "couponCode",
          ].forEach((key) => localStorage.removeItem(key));

          router.push(returnPath || "/");
        }, 3000);
      } catch (error: any) {
        console.error(error);
        setIsActivating(false);
        toast({
          title: "خطأ",
          description:
            error?.response?.data?.message || "حدث خطأ أثناء تفعيل الاشتراك.",
        });
        // setTimeout(() => router.push("/"), 3000);
      }
    };

    activateSubscription();
  }, [router]);

  return (
    <div className="min-h-screen pt-[100px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isActivating
              ? t("payment.activating")
              : t("payment.success_title")}
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {isActivating
              ? t("payment.activating_description")
              : t("payment.success_description")}
          </p>
        </div>

        {/* Logo in Circle */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border-4 border-blue-500">
            <Image
              src="/images/logo.png"
              alt="Smart Teacher"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="w-full max-w-4xl mx-auto shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Loading or Success Icon */}
            {isActivating ? (
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
                  {t("payment.processing")}
                </p>
              </div>
            ) : (
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-blue-500" />
                </div>
                <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
                  {t("payment.activation_complete")}
                </p>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.feature_schedule")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.feature_schedule_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.feature_support")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.feature_support_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.feature_community")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.feature_community_desc")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                onClick={() => router.push("/subjects")}
                disabled={isActivating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6"
              >
                {t("payment.start_learning")}
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                disabled={isActivating}
                className="flex-1 py-3 px-6"
              >
                {t("payment.go_home")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {socialLinks.map(({ href, icon: Icon }, index) => (
            <Link
              key={index}
              href={href}
              target="_blank"
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
            >
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Smart Teacher - {t("payment.support_available")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
