"use client";
import AccountEditForm from "@/components/forms/AccountEditForm";
import AccountView from "@/components/accounts/AccountView";
import ToastManager from "@/components/accounts/ToastManager";
import { RootState } from "@/store";

import { useSelector } from "react-redux";
import { AccountData } from "@/types/auth";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import ProfilePlaceholder from "@/components/loaders/ProfilePlaceholder";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { logout, setUser } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import {
  changePassword,
  deleteAccount,
  getAccount,
  updateAccount,
} from "@/store/account/accountThunks";

export default function AccountInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: accountUser, loading } = useSelector(
    (state: RootState) => state.account
  );
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  // دمج البيانات من auth و account
  const user = accountUser
    ? {
        ...accountUser,
        accountType: authUser?.accountType || accountUser?.accountType,
      }
    : null;

  useEffect(() => {
    dispatch(getAccount());
  }, [dispatch]);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (updatedData: AccountData) => {
    setPending(true);
    try {
      await dispatch(updateAccount(updatedData)).unwrap();
      // لا نحتاج لاستدعاء setUser لأن updateAccount يحدث البيانات في الـ store
      setIsEditing(false);
      // لا نحتاج للتوست هنا لأن ToastManager يتولى ذلك
    } catch (err: any) {
      // لا نحتاج للتوست هنا لأن ToastManager يتولى ذلك
    } finally {
      setPending(false);
    }
  };
  const handleChangePassword = () => setShowPasswordDialog(true);
  const handleDeleteAccount = () => setShowDeleteDialog(true);

  // تعديل submitPasswordChange ليغلق الديالوج فقط عند النجاح
  const submitPasswordChange = async () => {
    setPending(true);
    try {
      await dispatch(changePassword(passwords)).unwrap();
      setShowPasswordDialog(false);
      setPasswords({ oldPassword: "", newPassword: "" });
      toast({ title: t("profile.passwordChangedSuccess") });
    } catch (err: any) {
      toast({
        title: t("profile.passwordChangeError"),
        description: err?.message || "",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  // تعديل submitDeleteAccount ليغلق الديالوج فقط عند النجاح
  const submitDeleteAccount = async () => {
    if (!password.trim()) {
      toast({ title: "يرجى إدخال كلمة المرور", variant: "destructive" });
      return;
    }

    setPending(true);
    try {
      await dispatch(deleteAccount(password)).unwrap();
      setShowDeleteDialog(false);
      await dispatch(logout());
      toast({ title: t("profile.deleteAccountSuccess") });
      window.location.href = "/";
    } catch (err: any) {
      toast({
        title: t("profile.deleteAccountError"),
        description: err || "",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  if (loading) return <ProfilePlaceholder />;
  if (!user) return null;

  return (
    <div className="py-8 pt-[100px] ">
      {isEditing ? (
        <AccountEditForm
          data={user}
          onCancel={handleCancel}
          onSave={handleSave}
          pending={pending}
        />
      ) : (
        <AccountView
          data={user}
          onEdit={handleEdit}
          onChangePassword={handleChangePassword}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
      {/* Dialog تغيير كلمة المرور */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            {t("profile.changePassword")}
          </h3>

          <input
            type="password"
            placeholder={t("profile.enterCurrentPassword")}
            className="mb-3 p-3 w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, oldPassword: e.target.value }))
            }
            disabled={pending}
          />
          <input
            type="password"
            placeholder={t("profile.enterNewPassword")}
            className="mb-6 p-3 w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, newPassword: e.target.value }))
            }
            disabled={pending}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={pending}
              className="px-6 py-2 border-gray-400 text-gray-700 dark:text-white dark:border-gray-600"
            >
              {t("profile.cancel")}
            </Button>
            <Button
              onClick={submitPasswordChange}
              disabled={
                pending || !passwords.oldPassword || !passwords.newPassword
              }
              className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50`}
            >
              {pending ? (
                <span className="animate-pulse">{t("profile.saving")}</span>
              ) : (
                t("profile.changePassword")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog حذف الحساب */}
      {/* Dialog حذف الحساب */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 p-6 max-w-md mx-auto rounded-lg shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
            {t("parentChild.confirmDeleteTitle")}
          </h3>
          <p className="mb-4 dark:text-white">{t("profile.confirmDelete")}</p>

          {/* حقل كلمة المرور */}
          <input
            type="password"
            placeholder={t("parentChild.enterCurrentPassword")}
            className="mb-4 p-3 w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={pending}
            >
              {t("profile.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={submitDeleteAccount}
              disabled={pending || !password.trim()}
            >
              {pending ? (
                <span className="animate-pulse">{t("profile.deleting")}</span>
              ) : (
                t("profile.deleteAccount")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* أزل رسائل النجاح/الخطأ من هنا */}
    </div>
  );
}
