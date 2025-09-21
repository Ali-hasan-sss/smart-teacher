"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import { Calendar, GraduationCap, CreditCard, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackPageView } from "@/utils/gtm";
import { useEffect } from "react";
import { fetchParentHome } from "@/store/home/homeThunks";

interface SubscriptionsViewProps {
  accountType?: string;
}

export default function SubscriptionsView({
  accountType,
}: SubscriptionsViewProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // تحديد نوع الحساب
  const { user } = useSelector((state: RootState) => state.account);
  const finalAccountType = accountType || user?.accountType || "client";
  const isParent = finalAccountType.toLowerCase() === "parent";

  console.log("Props accountType:", accountType);
  console.log("User accountType:", user?.accountType);
  console.log("Final accountType:", finalAccountType, "isParent:", isParent);

  // جلب الاشتراكات حسب نوع الحساب
  const { items: regularSubscriptions, loading: regularLoading } = useSelector(
    (state: RootState) => state.subscription
  );

  const { parentData, parentLoading } = useSelector(
    (state: RootState) => state.home
  );

  // تحديد البيانات المناسبة
  console.log("SubscriptionsView Debug:", {
    isParent,
    parentData,
    children: parentData?.children,
    childrenCount: parentData?.children?.length,
    regularSubscriptions: regularSubscriptions?.length,
  });

  const subscriptions = isParent
    ? parentData?.children?.flatMap((child) => {
        console.log(
          "Processing child:",
          child.firstName,
          "subscriptions:",
          child.subscriptions?.length
        );
        return (
          child.subscriptions?.map((sub) => ({
            ...sub,
            childInfo: {
              firstName: child.firstName,
              lastName: child.lastName,
              image: child.image,
            },
          })) || []
        );
      }) || []
    : regularSubscriptions;

  console.log("Final subscriptions:", subscriptions?.length, subscriptions);
  const loading = isParent ? parentLoading : regularLoading;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = (expireAt: string) => {
    return new Date(expireAt) < new Date();
  };

  const getSemesterText = (semester: string) => {
    return semester === "First"
      ? t("subscriptions.first_semester")
      : t("subscriptions.second_semester");
  };

  // Track page view when component mounts
  useEffect(() => {
    trackPageView("/profile/subscriptions", "Subscriptions View");

    // جلب بيانات الأب إذا كان المستخدم أباً
    console.log(
      "useEffect - isParent:",
      isParent,
      "parentData exists:",
      !!parentData
    );
    if (isParent && !parentData) {
      console.log("Dispatching fetchParentHome...");
      dispatch(fetchParentHome() as any);
    }
  }, [isParent, parentData, dispatch, finalAccountType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log(
      "No subscriptions found - isParent:",
      isParent,
      "parentData:",
      parentData
    );

    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-6">
          <CreditCard className="w-20 h-20 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {isParent
            ? t("subscriptions.no_children_subscriptions") ||
              "لا توجد اشتراكات للأبناء"
            : t("subscriptions.no_subscriptions")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {isParent
            ? t("subscriptions.no_children_subscriptions_description") ||
              "لم تقم بالاشتراك في أي صف بعد"
            : t("subscriptions.no_subscriptions_description")}
        </p>
        {isParent && parentData && (
          <div className="mt-4 text-sm text-gray-400">
            <p>عدد الأطفال: {parentData.children?.length || 0}</p>
            <p>
              إجمالي الاشتراكات:{" "}
              {parentData.children?.reduce(
                (total, child) => total + (child.subscriptions?.length || 0),
                0
              ) || 0}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isParent
            ? t("subscriptions.children_subscriptions")
            : t("subscriptions.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isParent
            ? t("subscriptions.children_subtitle")
            : t("subscriptions.subtitle")}
        </p>
      </div>
      {subscriptions.map((subscription) => (
        <Card
          key={subscription.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
        >
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-800 dark:text-white block">
                    {subscription.grade.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {subscription.semester
                      ? getSemesterText(subscription.semester)
                      : subscription.plan?.title}
                  </span>
                  {/* عرض اسم الطفل إذا كان المستخدم أباً */}
                  {isParent && (subscription as any).childInfo && (
                    <div className="flex items-center gap-1 mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(subscription as any).childInfo.firstName}{" "}
                        {(subscription as any).childInfo.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    isExpired(subscription.expireAt) ? "destructive" : "default"
                  }
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    isExpired(subscription.expireAt)
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isExpired(subscription.expireAt)
                    ? t("subscriptions.expired")
                    : t("subscriptions.active")}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Dates */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t("subscriptions.start_date")}
                    </p>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-medium">
                      {formatDate(subscription.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                  <div
                    className={`p-2 rounded-lg ${
                      isExpired(subscription.expireAt)
                        ? "bg-red-500"
                        : "bg-orange-500"
                    }`}
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t("subscriptions.expiry_date")}
                    </p>
                    <p
                      className={`text-base font-medium ${
                        isExpired(subscription.expireAt)
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {formatDate(subscription.expireAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Cost */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t("subscriptions.cost")}
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {subscription.cost} {t("subscriptions.currency")}
                    </p>
                  </div>
                </div>

                {/* Progress Bar for Time Remaining */}
                {!isExpired(subscription.expireAt) && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("subscriptions.time_remaining")}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.ceil(
                          (new Date(subscription.expireAt).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        {t("subscriptions.days")}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              ((new Date(subscription.expireAt).getTime() -
                                new Date().getTime()) /
                                (new Date(subscription.expireAt).getTime() -
                                  new Date(subscription.createdAt).getTime())) *
                                100
                            )
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
