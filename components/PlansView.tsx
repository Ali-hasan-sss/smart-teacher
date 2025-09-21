"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlans } from "@/store/subscription/subscriptionThunks";
import { fetchAllGrades } from "@/store/grade/gradeThunk";
import type { RootState } from "@/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Check,
  Star,
  X,
  Calendar,
  Clock,
  Trophy,
  Settings,
  MessageCircle,
  Award,
  Users,
} from "lucide-react";
import LoaderCard from "./loaders/LoaderCard";
import { useTranslation } from "@/hooks/useTranslation";
import { trackSubscription } from "@/utils/gtm";
import { Grade } from "@/types/grade";
import { useRouter } from "next/navigation";

interface PlansViewProps {
  gradeId?: number;
  onSubscribe?: (planId: number, price: number, title: string) => void;
}

export default function PlansView({ gradeId, onSubscribe }: PlansViewProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: number;
    price: number;
    title: string;
  } | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  // البيانات الثابتة للخطط
  const staticPlans = [
    {
      id: 1,
      title: "الخطة الشهرية",
      type: "Monthly",
      price: 15.0,
      expiredAt: "2025-10-22 05:59",
    },
    {
      id: 2,
      title: "الخطة الفصلية",
      type: "Semesterly",
      price: 45.0,
      expiredAt: "2025-12-31 00:00",
    },
    {
      id: 3,
      title: "الخطة السنوية",
      type: "Yearly",
      price: 75.0,
      expiredAt: "2026-07-31 00:00",
    },
  ];

  const { plans, plansLoading, plansError } = useAppSelector(
    (state: RootState) => ({
      plans: state.subscription.plans,
      plansLoading: state.subscription.plansLoading,
      plansError: state.subscription.plansError,
    })
  );

  const { grades, loading: gradesLoading } = useAppSelector(
    (state: RootState) => ({
      grades: state.grades.grades,
      loading: state.grades.loading,
    })
  );

  const { user, token } = useAppSelector((state: RootState) => ({
    user: state.auth.user,
    token: state.auth.token,
  }));

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = Boolean(user && token);

  useEffect(() => {
    // تحميل البيانات فقط للمستخدمين المسجلين
    if (isLoggedIn) {
      dispatch(fetchPlans());
      dispatch(fetchAllGrades());
    }
  }, [dispatch, isLoggedIn]);

  const handleSubscribe = async (
    planId: number,
    price: number,
    title: string
  ) => {
    // إذا لم يكن المستخدم مسجل دخول، توجيهه لصفحة تسجيل الدخول
    if (!isLoggedIn) {
      // حفظ الصفحة الحالية لتوجيه المستخدم إليها بعد تسجيل الدخول
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
      }
      router.push("/login");
      return;
    }

    if (onSubscribe) {
      onSubscribe(planId, price, title);
      return;
    }

    // Open grade selection modal
    setSelectedPlan({ id: planId, price, title });
    setShowGradeModal(true);
  };

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrade(gradeId);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan || !selectedGrade) {
      alert(t("plan.select_grade_required"));
      return;
    }

    // Store selected data
    localStorage.setItem("selectedPlanId", selectedPlan.id.toString());
    localStorage.setItem("selectedGradeId", selectedGrade.toString());
    localStorage.setItem("currentPath", window.location.pathname);

    // Get selected grade details
    const selectedGradeDetails = grades.find(
      (grade) => grade.id === selectedGrade
    );

    try {
      const secretKey =
        process.env.NEXT_PUBLIC_THAWANI_SECRET_KEY ||
        "MiC3E4kMA6YDCcXhKwfCSX3DnXl9ZL";
      const publishableKey =
        process.env.NEXT_PUBLIC_THAWANI_PUBLIC_KEY ||
        "OezEMaPh3dC1E4v9w7JrRtA8KNOYXf";

      // Create product for selected grade
      if (!selectedGradeDetails) {
        alert(t("plan.grade_not_found"));
        return;
      }

      const products = [
        {
          name: `${selectedPlan.title} - ${selectedGradeDetails.title}`,
          quantity: 1,
          unit_amount: selectedPlan.price * 1000,
          description: `${t("plan.semester_1")}: ${
            selectedGradeDetails.firstSemesterPrice
          } ${t("plan.currency")}, ${t("plan.semester_2")}: ${
            selectedGradeDetails.secondSemesterPrice
          } ${t("plan.currency")}`,
        },
      ];

      const thawaniRes = await fetch(
        "https://checkout.thawani.om/api/v1/checkout/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "thawani-api-key": secretKey,
          },
          body: JSON.stringify({
            client_reference_id: `plan_${
              selectedPlan.id
            }_grade_${selectedGrade}_${Date.now()}`,
            mode: "payment",
            products: products,
            success_url: `${window.location.origin}/payment/success`,
            cancel_url: `${window.location.origin}/payment/cancel`,
            metadata: {
              plan_id: selectedPlan.id.toString(),
              plan_title: selectedPlan.title,
              selected_grade: selectedGrade.toString(),
              grade_title: selectedGradeDetails.title,
              price: selectedPlan.price.toString(),
            },
          }),
          signal: AbortSignal.timeout(30000),
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
        return;
      }

      if (!data.data || !data.data.session_id) {
        console.error("❌ Invalid response from Thawani API:", data);
        alert(t("plan.payment_error"));
        return;
      }

      const sessionId = data.data.session_id;
      const paymentUrl = `https://checkout.thawani.om/pay/${sessionId}?key=${publishableKey}`;

      localStorage.setItem("paymentSessionId", sessionId);
      trackSubscription(
        selectedPlan.id,
        selectedPlan.title,
        selectedPlan.price
      );
      window.location.href = paymentUrl;
    } catch (error: unknown) {
      console.error("❌ Payment error:", error);
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
    }
  };

  const handleCloseModal = () => {
    setShowGradeModal(false);
    setSelectedPlan(null);
    setSelectedGrade(null);
  };

  const handleLegacySubscription = async (
    planId: number,
    price: number,
    title: string
  ) => {
    if (!gradeId) {
      alert(t("plan.grade_not_defined"));
      return;
    }

    // Legacy code - kept for backward compatibility
    console.log("Legacy subscription with single grade:", gradeId);
  };

  const getPlanColor = (index: number) => {
    const colors = [
      "bg-green-500 hover:bg-green-600",
      "bg-red-500 hover:bg-red-600",
      "bg-blue-500 hover:bg-blue-600",
    ];
    return colors[index % colors.length];
  };

  const getPlanBorderColor = (index: number) => {
    const colors = ["border-green-200", "border-red-200", "border-blue-200"];
    return colors[index % colors.length];
  };

  const getPlanBgColor = (index: number) => {
    const colors = [
      "bg-green-50 dark:bg-green-900/20",
      "bg-red-50 dark:bg-red-900/20",
      "bg-blue-50 dark:bg-blue-900/20",
    ];
    return colors[index % colors.length];
  };

  const getPlanIcon = (planType: string) => {
    const type = planType.toLowerCase();
    if (type.includes("شهر") || type.includes("month")) {
      return Calendar;
    } else if (type.includes("فصل") || type.includes("semester")) {
      return Clock;
    } else if (type.includes("سن") || type.includes("year")) {
      return Trophy;
    }
    return Calendar; // default
  };

  const getPlanTopBorder = (index: number) => {
    const colors = [
      "border-t-green-500",
      "border-t-red-500",
      "border-t-blue-500",
    ];
    return colors[index % colors.length];
  };

  const calculateExpiryDate = (planType: string) => {
    const currentDate = new Date();
    const type = planType.toLowerCase();

    if (type.includes("شهر") || type.includes("month")) {
      // شهرية - شهر واحد
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (type.includes("فصل") || type.includes("semester")) {
      // فصلية - 4 أشهر
      currentDate.setMonth(currentDate.getMonth() + 4);
    } else if (type.includes("سن") || type.includes("year")) {
      // سنوية - 12 شهر
      currentDate.setMonth(currentDate.getMonth() + 12);
    } else {
      // افتراضي - شهر واحد
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return currentDate.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (plansError && isLoggedIn) {
    return (
      <div className="text-center mt-[100px] py-8">
        <p className="text-red-500">{t("plan.loading_error")}</p>
        <Button
          onClick={() => dispatch(fetchPlans())}
          className="mt-4"
          variant="outline"
        >
          {t("plan.retry")}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Full Width Header Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12 pt-[150px] w-full">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">{t("plans.title")}</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("plans.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Plans Grid */}
        {plansLoading && isLoggedIn ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoaderCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(isLoggedIn ? plans : staticPlans).map((plan, index) => {
              const IconComponent = getPlanIcon(plan.type);
              const expiryDate = calculateExpiryDate(plan.type);

              return (
                <Card
                  key={plan.id}
                  className={`relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 ${getPlanTopBorder(
                    index
                  )} ${getPlanBgColor(
                    index
                  )} overflow-hidden bg-white dark:bg-gray-800`}
                >
                  {/* Popular Badge for middle plan */}
                  {index === 1 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {t("plans.most_popular")}
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Plan Header with Icon */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <IconComponent
                          className={`w-6 h-6 ${
                            index === 0
                              ? "text-green-500"
                              : index === 1
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                          {plan.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {plan.type}
                      </p>
                      {/* وصف مخصص لكل خطة */}
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {(() => {
                          const type = plan.type.toLowerCase();
                          if (type.includes("شهر") || type.includes("month")) {
                            return t("plans.monthly_description");
                          } else if (
                            type.includes("فصل") ||
                            type.includes("semester")
                          ) {
                            return t("plans.semester_description");
                          } else if (
                            type.includes("سن") ||
                            type.includes("year")
                          ) {
                            return t("plans.yearly_description");
                          }
                          return t("plans.monthly_description");
                        })()}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {t("plan.currency")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("plan.duration_description")}
                      </p>
                    </div>

                    {/* Features List - نفس المميزات لجميع الخطط */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {[
                          t("plans.premium_feature1"),
                          t("plans.premium_feature2"),
                          t("plans.premium_feature3"),
                          t("plans.premium_feature4"),
                        ].map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-200 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expiry Date */}
                    <div className="text-center mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {t("plan.expires_on")}: {expiryDate}
                        </span>
                      </div>
                    </div>

                    {/* Subscribe Button */}
                    <Button
                      onClick={() =>
                        handleSubscribe(plan.id, plan.price, plan.title)
                      }
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 ${getPlanColor(
                        index
                      )}`}
                    >
                      {t("plan.subscribe")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State - فقط للمستخدمين المسجلين */}
        {!plansLoading && isLoggedIn && plans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t("plans.no_plans")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t("plans.check_later")}
            </p>
          </div>
        )}

        {/* Grade Selection Modal */}
        {showGradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto mx-4">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("plan.select_grades")}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Plan Info */}
                {selectedPlan && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedPlan.title}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-blue-600 dark:text-blue-400">
                        {selectedPlan.price} {t("plan.currency")}
                      </p>

                      {/* Selected Grade Preview */}
                      {selectedGrade && (
                        <div className="bg-white dark:bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("plan.selected_grade")}:
                          </p>
                          {(() => {
                            const grade = grades.find(
                              (g) => g.id === selectedGrade
                            );
                            return grade ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {selectedPlan.title} - {grade.title}
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {selectedPlan.price} {t("plan.currency")}
                                </span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Grades List */}
                <div className="mb-6">
                  {gradesLoading ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">
                        {t("plan.loading_grades")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {grades.map((grade) => (
                        <div
                          key={grade.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                            selectedGrade === grade.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                          }`}
                          onClick={() => handleGradeSelect(grade.id)}
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedGrade === grade.id
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300 dark:border-gray-500"
                              }`}
                            >
                              {selectedGrade === grade.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {grade.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 order-2 sm:order-1"
                  >
                    {t("plan.cancel")}
                  </Button>
                  <Button
                    onClick={handleConfirmSubscription}
                    disabled={!selectedGrade}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
                  >
                    {t("plan.confirm_subscription")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Why Choose Smart Teacher Section */}
        <section className="mt-16 py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("plans.why_choose_smart_teacher")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              {t("plans.why_choose_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("plans.feature_tests")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("plans.feature_tests_desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("plans.feature_interaction")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("plans.feature_interaction_desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("plans.feature_comprehensive")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("plans.feature_comprehensive_desc")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("plans.feature_specialized")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {t("plans.feature_specialized_desc")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
