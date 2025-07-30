"use client";
import AccountEditForm from "@/components/AccountEditForm";
import AccountView from "@/components/AccountView";
import { RootState } from "@/store";
import {
  updateAccount,
  deleteAccount,
  changePassword,
  getAccount,
} from "@/store/account/accountSlice";
import { useSelector } from "react-redux";
import { AccountData } from "@/types/auth";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import ProfilePlaceholder from "@/components/loaders/ProfilePlaceholder";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { setUser } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

export default function AccountInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.account
  );
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getAccount());
  }, [dispatch]);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (updatedData: AccountData) => {
    setPending(true);
    try {
      const result = await dispatch(updateAccount(updatedData)).unwrap();
      dispatch(setUser(result));
      setIsEditing(false);
      toast({ title: "تم تحديث البيانات بنجاح" });
    } catch (err: any) {
      toast({
        title: "حدث خطأ أثناء التحديث",
        description: err?.message || "",
        variant: "destructive",
      });
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
      toast({ title: "تم تغيير كلمة المرور بنجاح" });
    } catch (err: any) {
      toast({
        title: "حدث خطأ أثناء تغيير كلمة المرور",
        description: err?.message || "",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  // تعديل submitDeleteAccount ليغلق الديالوج فقط عند النجاح
  const submitDeleteAccount = async () => {
    setPending(true);
    try {
      await dispatch(deleteAccount()).unwrap();
      setShowDeleteDialog(false);
      router.push("/");
      toast({ title: "تم حذف الحساب بنجاح" });
    } catch (err: any) {
      toast({
        title: "حدث خطأ أثناء حذف الحساب",
        description: err?.message || "",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };
  if (loading) return <ProfilePlaceholder />;
  if (error) return <p className="text-red-600 mb-4">{error}</p>;
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
        <DialogContent className="bg-white dark:bg-gray-800">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            {t("profile.changePassword")}
          </h3>
          <input
            type="password"
            placeholder={t("profile.currentPassword")}
            className="mb-2 p-2 w-full rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, oldPassword: e.target.value }))
            }
            disabled={pending}
          />
          <input
            type="password"
            placeholder={t("profile.newPassword")}
            className="mb-4 p-2 w-full rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((p) => ({ ...p, newPassword: e.target.value }))
            }
            disabled={pending}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={pending}
            >
              {t("profile.cancel")}
            </Button>
            <Button onClick={submitPasswordChange} disabled={pending}>
              {pending ? (
                <span className="animate-pulse">{t("profile.saving")}</span>
              ) : (
                t("profile.save")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog حذف الحساب */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <h3 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">
            {t("profile.confirmDeleteTitle")}
          </h3>
          <p className="mb-4 dark:text-white">{t("profile.confirmDelete")}</p>
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
              disabled={pending}
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
