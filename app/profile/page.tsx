"use client";
import AccountEditForm from "@/components/AccountEditForm";
import AccountView from "@/components/AccountView";
import { RootState } from "@/store";
import { getAccount } from "@/store/account/accountSlice";
import { useAppDispatch } from "@/store/hooks";
import { AccountData } from "@/types/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AccountInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [accountData, setAccountData] = useState<AccountData>();
  const { user, loading, error, successMessage } = useSelector(
    (state: RootState) => state.account
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccount());
  }, [dispatch]);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = (updatedData: AccountData) => {
    // هنا تنفذ دالة API لتحديث البيانات (مثلاً dispatch redux thunk)
    // بعد نجاح التحديث نحدث الحالة محليًا:
    setAccountData(updatedData);
    setIsEditing(false);
  };
  if (!user) {
    return <p>جارٍ تحميل البيانات...</p>;
  }
  return (
    <>
      {isEditing ? (
        <AccountEditForm
          data={user}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      ) : (
        <AccountView data={user} onEdit={handleEdit} />
      )}
    </>
  );
}
