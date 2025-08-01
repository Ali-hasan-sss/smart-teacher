"use client";

import { Bookmark, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Progress } from "./ui/progress";
import { formatDuration } from "@/utils/formatDuration";

interface CourseCardProps {
  id: number;
  image?: string;
  title: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (courseId: number) => void;
  toggleLoading?: boolean;
  isComplite?: boolean;
  duration: number;
  totalDuration?: number;
}

export default function CourseCard({
  id,
  image,
  title,
  isBookmarked,
  isComplite,
  onToggleBookmark,
  duration,
  totalDuration = 30 * 60,
}: CourseCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { toggleLoading } = useSelector((state: RootState) => state.bookmark);
  const progressPercent = (duration / totalDuration) * 100;

  const totaltext = formatDuration(totalDuration, "ar");
  return (
    <div className="bg-white pb-1 dark:bg-gray-800 rounded-lg shadow-md  relative">
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
      {typeof progressPercent === "number" && (
        <div className="px-4 mb-2">
          {progressPercent > 0 ? (
            <Progress value={progressPercent} />
          ) : (
            <div className="h-4 rounded-full bg-transparent opacity-0 pointer-events-none" />
          )}
        </div>
      )}

      {typeof progressPercent === "number" && (
        <div className="px-4 mb-2">
          {totalDuration > 0 ? (
            <div className="flex items-center gap-2">
              <Timer /> <p>{totaltext}</p>
            </div>
          ) : (
            <div className="h-4 rounded-full bg-transparent opacity-0 pointer-events-none" />
          )}
        </div>
      )}

      <div className="flex items-center px-4 justify-between my-3">
        <div
          onClick={() => router.push(`/courses/${id}`)}
          className="bg-blue-600 w-full text-center text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
        >
          {isComplite ? t("courses.complete") : t("courses.startLearning")}
        </div>
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(id)}
            className="mr-2 text-blue-600 relative w-[40px] h-[40px] flex items-center justify-center"
            title={
              isBookmarked
                ? t("courses.save_bookMark")
                : t("courses.remove_bookMark")
            }
          >
            <div className="w-[35px] h-[35px] flex items-center justify-center">
              {toggleLoading === id ? (
                <svg
                  className="w-[30px] h-[30px] text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    className="stroke-path"
                    d="M5 3v18l7-5 7 5V3H5z"
                    style={{
                      strokeDasharray: 100,
                      strokeDashoffset: 100,
                      animation: "dash 2s linear forwards infinite",
                    }}
                  />
                </svg>
              ) : (
                <Bookmark size={35} fill={isBookmarked ? "#2563eb" : "none"} />
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
