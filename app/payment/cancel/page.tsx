"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  CreditCard,
  HelpCircle,
  Phone,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { socialLinks } from "@/utils/socialLimk";
import Link from "next/link";
import Image from "next/image";

export default function PaymentCancel() {
  const router = useRouter();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const cleanupData = () => {
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
        "subscriptionType",
        "subscriptionChildAccountIds",
        "subscriptionGradeIds",
        "subscriptionSubjectId",
      ].forEach((key) => localStorage.removeItem(key));
    };
  }, [router]);

  const handleRetryPayment = () => {
    router.push("/plans");
  };

  const handleGoHome = () => {
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
      "subscriptionType",
      "subscriptionChildAccountIds",
      "subscriptionGradeIds",
      "subscriptionSubjectId",
    ].forEach((key) => localStorage.removeItem(key));

    router.push("/");
  };

  return (
    <div className="min-h-screen pt-[100px] bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("payment.cancel_title")}
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t("payment.cancel_description")}
          </p>
        </div>

        {/* Logo in Circle */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border-4 border-red-500">
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
            {/* Cancel Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 mt-4 font-medium">
                {t("payment.operation_cancelled")}
              </p>
            </div>

            {/* Reasons and Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.payment_methods")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.payment_methods_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.need_help")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.need_help_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("payment.contact_support")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("payment.contact_support_desc")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t("payment.retry_payment")}
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1 py-3 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
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
              <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
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
