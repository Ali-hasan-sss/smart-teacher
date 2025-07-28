"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface CourseCardProps {
  id: number;
  image?: string;
  title: string;
  isBookmarked: boolean;
  onToggleBookmark: (courseId: number) => void;
}

export default function CourseCard({
  id,
  image,
  title,
  isBookmarked,
  onToggleBookmark,
}: CourseCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md  relative">
      {image && (
        <img
          src={image}
          alt={title || "عنوان غير متوفر"}
          className="w-full h-48 object-cover  rounded mb-4"
        />
      )}

      <h3 className="text-xl px-4 font-semibold mb-2">
        {title || "عنوان غير متوفر"}
      </h3>

      <div className="flex items-center px-4 justify-between my-3">
        <div
          onClick={() => router.push(`/courses/${id}`)}
          className="bg-blue-600 w-full text-center text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
        >
          {t("courses.startLearning")}
        </div>
        <button
          onClick={() => onToggleBookmark(id)}
          className="ml-2 mx-2 text-blue-600 hover:text-blue-800"
          title={isBookmarked ? "إزالة من المفضلة" : "حفظ في المفضلة"}
        >
          <Bookmark size={24} fill={isBookmarked ? "#2563eb" : "none"} />
        </button>
      </div>
    </div>
  );
}
