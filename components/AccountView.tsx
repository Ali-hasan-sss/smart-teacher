import { AccountData } from "@/types/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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
  return (
    <div className="relative max-w-lg mx-auto mt-8 p-0 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center py-10 px-6">
        <div className="relative mb-4">
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
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-white mb-1 flex items-center gap-2">
          <User className="inline text-blue-400" />
          {data.firstName} {data.lastName}
        </h2>
        <div className="flex flex-col gap-2 mt-10 text-base text-gray-700 dark:text-gray-200 w-full max-w-xs mx-auto mb-6">
          <div className="flex items-center gap-2">
            <Phone className="text-blue-300" />
            <span className="font-semibold">{t("profile.phone")}:</span>{" "}
            {data.phoneNumber}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="inline text-blue-300" />
            {data.email}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-300" />
            <span className="font-semibold">
              {t("profile.birthdate")}:
            </span>{" "}
            {data.birthdate?.slice(0, 10)}
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-300" />
            <span className="font-semibold">{t("profile.grade")}:</span>{" "}
            {data.grade?.title}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <Button className="w-full sm:w-auto" onClick={onEdit}>
            {t("profile.edit")}
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={onChangePassword}
          >
            {t("profile.changePassword")}
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="destructive"
            onClick={onDeleteAccount}
          >
            {t("profile.deleteAccount")}
          </Button>
        </div>
      </div>
    </div>
  );
}
