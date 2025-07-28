import { AccountData } from "@/types/auth";

interface AccountViewProps {
  data: AccountData;
  onEdit: () => void;
}

export default function AccountView({ data, onEdit }: AccountViewProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">معلومات الحساب</h2>
      <div className="mb-4">
        <strong>الاسم الأول: </strong> {data.firstName}
      </div>
      <div className="mb-4">
        <strong>اسم العائلة: </strong> {data.lastName}
      </div>
      <div className="mb-4">
        <strong>البريد الإلكتروني: </strong> {data.email}
      </div>
      <div className="mb-4">
        <strong>رقم الهاتف: </strong> {data.phoneNumber}
      </div>
      <div className="mb-4">
        <strong>تاريخ الميلاد: </strong> {data.birthdate}
      </div>
      <div className="mb-4">
        <strong>الصف الدراسي: </strong> {data.grade?.title}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onEdit}
      >
        تعديل البيانات
      </button>
    </div>
  );
}
