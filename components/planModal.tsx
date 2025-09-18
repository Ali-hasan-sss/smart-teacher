"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans } from "@/store/subscription/subscriptionThunks";
import type { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import LoaderCard from "./loaders/LoaderCard";
import { useTranslation } from "@/hooks/useTranslation";
import { trackSubscription } from "@/utils/gtm";
interface PlansModalProps {
  courseId: number;
  gradeId: number;
  onClose: () => void;
}

export default function PlansModal({
  courseId,
  gradeId,
  onClose,
}: PlansModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { plans, plansLoading } = useAppSelector((state: RootState) => ({
    plans: state.subscription.plans,
    plansLoading: state.subscription.plansLoading,
  }));
  const [subscribingId, setSubscribingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSubscribe = async (
    planId: number,
    price: number,
    title: string
  ) => {
    if (!gradeId) {
      alert(t("plan.grade_not_defined"));
      return;
    }

    setSubscribingId(planId);

    localStorage.setItem("selectedPlanId", planId.toString());
    localStorage.setItem("selectedGradeId", gradeId.toString());
    localStorage.setItem("currentPath", window.location.pathname);

    try {
      // مفاتيح Thawani API من متغيرات البيئة
      const secretKey =
        process.env.NEXT_PUBLIC_THAWANI_SECRET_KEY ||
        "MiC3E4kMA6YDCcXhKwfCSX3DnXl9ZL";
      const publishableKey =
        process.env.NEXT_PUBLIC_THAWANI_PUBLIC_KEY ||
        "OezEMaPh3dC1E4v9w7JrRtA8KNOYXf";

      console.log("🚀 Creating payment session directly from frontend");
      console.log("📋 Plan details:", { planId, price, title, gradeId });

      // إنشاء جلسة الدفع مباشرة من الواجهة الأمامية
      const thawaniRes = await fetch(
        "https://checkout.thawani.om/api/v1/checkout/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "thawani-api-key": secretKey,
          },
          body: JSON.stringify({
            client_reference_id: `plan_${planId}_${Date.now()}`,
            mode: "payment",
            products: [
              {
                name: title,
                quantity: 1,
                unit_amount: price * 1000, // تحويل إلى فلس
              },
            ],
            success_url: `${window.location.origin}/payment/success`,
            cancel_url: `${window.location.origin}/payment/cancel`,
          }),
          signal: AbortSignal.timeout(30000), // 30 ثانية timeout
        }
      );

      const data = await thawaniRes.json();

      if (!thawaniRes.ok) {
        console.error("❌ Thawani API Error:", data);

        if (thawaniRes.status === 401) {
          alert(t("plan.api_key_invalid"));
        } else {
          alert(t("plan.payment_service_error"));
        }
        setSubscribingId(null);
        return;
      }

      if (!data.data || !data.data.session_id) {
        console.error("❌ Invalid response from Thawani API:", data);
        alert(t("plan.payment_error"));
        setSubscribingId(null);
        return;
      }

      const sessionId = data.data.session_id;
      const paymentUrl = `https://checkout.thawani.om/pay/${sessionId}?key=${publishableKey}`;

      console.log("✅ Payment session created successfully!");
      console.log("🆔 Session ID:", sessionId);
      console.log("🔗 Payment URL:", paymentUrl);

      // حفظ بيانات الجلسة
      localStorage.setItem("paymentSessionId", sessionId);

      // تتبع حدث الاشتراك
      trackSubscription(planId, title, price);

      // توجيه إلى صفحة الدفع
      window.location.href = paymentUrl;
    } catch (error: unknown) {
      console.error("❌ Payment error:", error);

      // تحديد نوع الخطأ
      if (
        error instanceof TypeError &&
        error.message.includes("fetch failed")
      ) {
        alert(t("plan.network_error_detailed"));
      } else if (error instanceof Error && error.name === "AbortError") {
        alert(t("plan.request_timeout"));
      } else {
        alert(t("plan.payment_failed"));
      }

      setSubscribingId(null);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-6">
        {t("plan.available")}
      </h1>

      {plansLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoaderCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <Card
              key={plan.id}
              className="rounded-2xl shadow-md hover:shadow-xl transition bg-third min-h-[250px] flex flex-col justify-between"
            >
              <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>

                <div className="flex-1 text-center">
                  <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("plan.type")}: {plan.type}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {t("plan.price")}: {plan.price} {t("plan.currency")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {t("plan.expired")}:{" "}
                    {plan.expiredAt
                      ? new Date(plan.expiredAt).toLocaleDateString("ar-EG")
                      : "-"}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    handleSubscribe(plan.id, plan.price, plan.title)
                  }
                  disabled={subscribingId === plan.id}
                  className="w-full rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  {subscribingId === plan.id ? (
                    <Loader2 className="animate-spin w-4 h-4 ml-2" />
                  ) : (
                    t("plan.subscribe")
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
