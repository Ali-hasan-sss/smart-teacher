"use client";

import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useRef } from "react";

export default function PaymentSuccess() {
  const router = useRouter();
  const activatedRef = useRef(false);

  useEffect(() => {
    if (activatedRef.current) return;
    activatedRef.current = true;

    const activateSubscription = async () => {
      const planId = localStorage.getItem("selectedPlanId");
      const gradeId = localStorage.getItem("selectedGradeId");
      const sessionId = localStorage.getItem("paymentSessionId");

      if (!planId || !gradeId || !sessionId) {
        toast({
          title: "فشل العملية",
          description: "بيانات الاشتراك غير مكتملة.",
        });
        router.push("/");
        return;
      }

      if (localStorage.getItem(`activated_${sessionId}`)) {
        router.push(localStorage.getItem("currentPath") || "/");
        return;
      }

      try {
        await axios.post("/api/Client/Subscription", {
          planId: +planId,
          gradeId: +gradeId,
          sessionId,
        });

        localStorage.setItem(`activated_${sessionId}`, "true");
        const previousPath = localStorage.getItem("currentPath") || "/";

        [
          "selectedPlanId",
          "selectedGradeId",
          "paymentSessionId",
          "currentPath",
        ].forEach((key) => localStorage.removeItem(key));

        toast({
          title: "تم بنجاح",
          description: "✅ تم تفعيل الاشتراك بنجاح!",
        });

        router.push(previousPath);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "خطأ",
          description:
            error?.response?.data?.message || "حدث خطأ أثناء تفعيل الاشتراك.",
        });
        router.push("/");
      }
    };

    activateSubscription();
  }, [router]);
}
