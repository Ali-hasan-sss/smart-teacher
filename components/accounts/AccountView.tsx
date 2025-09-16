import { AccountData } from "@/types/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import AccountTabs from "./AccountTabs";
import ToastManager from "./ToastManager";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AccountViewProps {
  data: AccountData;
  onEdit: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
}
export default function AccountView({
  data,
  onEdit,
  onChangePassword,
  onDeleteAccount,
}: AccountViewProps) {
  const { t } = useTranslation();

  const accountType = data.accountType?.toLowerCase();

  return (
    <div className="relative max-w-7xl mx-auto mt-8 p-6 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ToastManager />
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-blue-400 shadow-lg">
            <AvatarImage
              src={data.image}
              alt={data.firstName + " " + data.lastName}
            />
            <AvatarFallback>
              {(data.firstName?.[0] || "") + (data.lastName?.[0] || "")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
            <User className="inline text-blue-400" />
            {data.firstName} {data.lastName}
          </h2>

          {/* Account Type Badge */}
          <div className="flex justify-center lg:justify-start mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {(() => {
                const accountType = data.accountType?.toLowerCase();
                if (accountType === "parent") return t("profile.parent");
                if (accountType === "teacher") return t("profile.teacher");
                if (accountType === "client") return t("profile.student");
                return t("profile.student"); // default
              })()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-base text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-2">
              <Phone className="text-blue-300" />
              <span className="font-semibold">{t("profile.phone")}:</span>{" "}
              {data.phoneNumber}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="inline text-blue-300" />
              <span className="font-semibold">{t("profile.email")}:</span>{" "}
              {data.email}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-300" />
              <span className="font-semibold">
                {t("profile.birthdate")}:
              </span>{" "}
              {data.birthdate?.slice(0, 10)}
            </div>
            {accountType !== "parent" && (
              <div className="flex items-center gap-2">
                <GraduationCap className="text-blue-300" />
                <span className="font-semibold">
                  {t("profile.grade")}:
                </span>{" "}
                {data.grade?.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Tabs */}
      <AccountTabs
        data={data}
        onEdit={onEdit}
        onChangePassword={onChangePassword}
        onDeleteAccount={onDeleteAccount}
      />
    </div>
  );
}
