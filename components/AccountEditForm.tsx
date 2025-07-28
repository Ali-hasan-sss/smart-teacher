import { AccountData } from "@/types/auth";
import { useState, ChangeEvent, FormEvent } from "react";

interface AccountEditFormProps {
  data: AccountData;
  onCancel: () => void;
  onSave: (updatedData: AccountData) => void;
}

export default function AccountEditForm({
  data,
  onCancel,
  onSave,
}: AccountEditFormProps) {
  const [formData, setFormData] = useState<AccountData>(data);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white dark:bg-gray-800 rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">تعديل الحساب</h2>

      <label className="block mb-2">
        الاسم الأول
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 p-2 w-full rounded border"
        />
      </label>

      <label className="block mb-2">
        اسم العائلة
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="mt-1 p-2 w-full rounded border"
        />
      </label>

      <label className="block mb-2">
        البريد الإلكتروني
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 w-full rounded border"
        />
      </label>

      <label className="block mb-2">
        رقم الهاتف
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 p-2 w-full rounded border"
        />
      </label>

      <label className="block mb-2">
        تاريخ الميلاد
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate.slice(0, 10)} // اختصار التاريخ
          onChange={handleChange}
          className="mt-1 p-2 w-full rounded border"
        />
      </label>

      {/* للصف الدراسي يمكنك عمل Select لو أردت */}
      <label className="block mb-4">
        الصف الدراسي
        <input
          type="text"
          name="grade"
          value={formData.grade.title}
          readOnly
          className="mt-1 p-2 w-full rounded border bg-gray-100 cursor-not-allowed"
        />
      </label>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          حفظ
        </button>
      </div>
    </form>
  );
}
