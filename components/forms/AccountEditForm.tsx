import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  User,
  Camera,
  Trash2,
} from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";
import { useTranslation } from "@/hooks/useTranslation";
import GradeSelect from "./GradeSelect";

interface AccountEditFormProps {
  data: any;
  onCancel: () => void;
  onSave: (updatedData: any) => void;
  pending?: boolean;
}

export default function AccountEditForm({
  data,
  onCancel,
  onSave,
  pending,
}: AccountEditFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    ...data,
    gradeId: data.grade?.id?.toString() ?? "",
  });
  const [uploading, setUploading] = useState(false);

  const [newImage, setNewImage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await axios.post(
          "/api/Common/BaseFile/UploadAnyFile",
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl = res.data?.data?.url;
        setFormData((prev: any) => ({ ...prev, image: imageUrl }));
        setNewImage(imageUrl || null);
      } catch (err) {
      } finally {
        setUploading(false);
      }
    }
  };
  const handleGradeChange = (value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      gradeId: value.toString(),
    }));
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setFormData((prev: any) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...formData });
  };

  const getImageUrl = (img: string | null) => {
    if (!img) return "";
    return img;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative max-w-xl mx-auto mt-8 p-0 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="flex flex-col items-center py-10 px-6">
        <div className="relative mb-4">
          <Avatar className="w-32 h-32 border-4 border-blue-400 shadow-lg">
            <AvatarImage
              src={getImageUrl(newImage ?? formData.image)}
              alt={formData.firstName + " " + formData.lastName}
            />
            <AvatarFallback>
              {(formData.firstName?.[0] || "") + (formData.lastName?.[0] || "")}
            </AvatarFallback>
            {(uploading || pending) && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                <span className="text-blue-600 font-bold animate-pulse">
                  {t("profile.uploading")}
                </span>
              </div>
            )}
          </Avatar>
          {/* زر تغيير الصورة */}
          <label
            className={`absolute bottom-2 left-2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-blue-100 transition-all border border-blue-300 ${
              pending ? "pointer-events-none opacity-60" : ""
            }`}
            title={t("profile.uploadImage")}
          >
            <Camera className="w-5 h-5 text-blue-600" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={pending}
            />
          </label>
          {/* زر إزالة الصورة */}
          {(newImage || formData.image) && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-100 transition-all border border-red-300 ${
                pending ? "pointer-events-none opacity-60" : ""
              }`}
              disabled={pending}
              title={t("profile.removeImage")}
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-white mb-1 flex items-center gap-2">
          <User className="inline text-blue-400" />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="bg-transparent border-b-2 border-blue-200 focus:border-blue-500 outline-none text-inherit font-bold w-24 text-center"
            placeholder={t("profile.firstName")}
            disabled={pending}
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="bg-transparent border-b-2 border-blue-200 focus:border-blue-500 outline-none text-inherit font-bold w-24 text-center"
            placeholder={t("profile.lastName")}
            disabled={pending}
          />
        </h2>
        <div className="flex flex-col gap-2 mt-10 text-base text-gray-700 dark:text-gray-200 w-full max-w-xs mx-auto mb-6">
          <div className="flex items-center gap-2">
            <Phone className="text-blue-300" />
            <span className="font-semibold">{t("profile.phone")}:</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="bg-transparent border-b border-blue-100 focus:border-blue-400 outline-none w-32 text-inherit"
              placeholder={t("profile.phone")}
              disabled={pending}
            />
          </div>
          <div className="flex w-full  items-center gap-2">
            <Mail className="inline text-blue-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent w-full border-b border-blue-100 focus:border-blue-400 outline-none text-inherit"
              placeholder={t("profile.email")}
              disabled={pending}
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-300" />
            <span className="font-semibold">{t("profile.birthdate")}:</span>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate?.slice(0, 10) || ""}
              onChange={handleChange}
              className="bg-transparent border-b border-blue-100 focus:border-blue-400 outline-none w-32 text-inherit"
              disabled={pending}
            />
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-300" />
            <span className="font-semibold">{t("profile.grade")}:</span>
            <GradeSelect
              value={parseInt(formData.gradeId || "0")}
              onChange={handleGradeChange}
              placeholder="اختر الصف الدراسي"
              className="mb-4"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            {t("profile.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white"
            disabled={pending}
          >
            {pending ? (
              <span className="animate-pulse">{t("profile.saving")}</span>
            ) : (
              t("profile.save")
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
