"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/language-context";
import { AccountData } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  User,
  CreditCard,
  Users,
  Mail,
  Phone,
  Key,
  Trash2,
  Settings,
} from "lucide-react";
import SubscriptionsView from "../SubscriptionsView";
import EmailPhoneManagement from "./EmailPhoneManagement";
import ParentChildManagement from "./ParentChildManagement";
import ToastManager from "./ToastManager";

interface AccountTabsProps {
  data: AccountData;
  onEdit: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}

export default function AccountTabs({
  data,
  onEdit,
  onChangePassword,
  onDeleteAccount,
}: AccountTabsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showParentChild, setShowParentChild] = useState(false);

  const isRTL = language === "ar";

  // تحديد نوع الحساب
  const accountType = data.accountType || "client";
  const isClient = accountType?.toLowerCase() === "client";
  const isParent = accountType?.toLowerCase() === "parent";
  const isTeacher = accountType?.toLowerCase() === "teacher";

  return (
    <div className="w-full max-w-6xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <ToastManager />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-0 h-auto">
          <TabsTrigger
            value="profile"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
          >
            <User className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{t("profile.profile")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              {isParent
                ? t("subscriptions.childrenSubscriptions")
                : t("subscriptions.title")}
            </span>
          </TabsTrigger>
          {!isTeacher && (
            <TabsTrigger
              value="relationships"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                {isClient
                  ? t("profile.parents_tab")
                  : t("profile.children_tab")}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger
            value="security"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{t("profile.security")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <User className="w-5 h-5" />
                {t("profile.profile_information")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`flex flex-col lg:flex-row gap-6 ${
                  isRTL ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {t("profile.first_name")}
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {data.firstName}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {t("profile.last_name")}
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {data.lastName}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {t("profile.email")}
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                        {data.email}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {t("profile.phone")}
                      </label>
                      <p
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                        dir="ltr"
                      >
                        {data.phoneNumber}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {t("profile.birthdate")}
                      </label>
                      <p
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                        dir="ltr"
                      >
                        {data.birthdate?.slice(0, 10)}
                      </p>
                    </div>
                    {!isParent && (
                      <div
                        className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          {t("profile.grade")}
                        </label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {data.grade?.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`flex flex-col gap-3 lg:min-w-[200px] ${
                    isRTL ? "lg:items-end" : "lg:items-start"
                  }`}
                >
                  <div className="w-full p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3
                      className={`text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("profile.quick_actions")}
                    </h3>
                    <Button
                      onClick={onEdit}
                      className="w-full bg-blue-600 text-white hover:bg-blue-500"
                    >
                      {t("profile.edit_profile")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="mt-6">
          <SubscriptionsView accountType={accountType} />
        </TabsContent>

        {/* Relationships Tab */}
        {!isTeacher && (
          <TabsContent value="relationships" className="mt-6">
            <ParentChildManagement
              isOpen={true}
              onClose={() => {}}
              accountType={accountType}
              showInTab={true}
            />
          </TabsContent>
        )}

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            {/* Email & Phone Management */}
            <EmailPhoneManagement user={data} />

            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <Key className="w-5 h-5" />
                  {t("profile.password_management")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t("profile.change_password")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("profile.change_password_description")}
                    </p>
                  </div>
                  <Button onClick={onChangePassword} variant="outline">
                    {t("profile.change_password")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Deletion */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 text-red-600 dark:text-red-400 ${
                    isRTL ? "flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  {t("profile.danger_zone")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`${isRTL ? "text-right" : "text-left"}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t("profile.delete_account")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("profile.delete_account_description")}
                    </p>
                  </div>
                  <Button onClick={onDeleteAccount} variant="destructive">
                    {t("profile.delete_account")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Parent Child Management Modal */}
      <ParentChildManagement
        isOpen={showParentChild}
        onClose={() => setShowParentChild(false)}
        accountType={accountType}
      />
    </div>
  );
}
