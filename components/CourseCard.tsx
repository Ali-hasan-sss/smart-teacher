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
  description: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (courseId: number) => void;
  toggleLoading?: boolean;
  duration: number;
  courseDuration: number;
}

export default function CourseCard({
  id,
  image,
  title,
  description,
  isBookmarked,
  onToggleBookmark,
  duration,
  courseDuration,
}: CourseCardProps) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { toggleLoading } = useSelector((state: RootState) => state.bookmark);

  let progressPercent = 0;
  let isComplete = false;

  if (
    typeof duration === "number" &&
    typeof courseDuration === "number" &&
    courseDuration > 0
  ) {
    if (duration >= courseDuration) {
      progressPercent = 1;
      isComplete = true;
    } else {
      progressPercent = duration / courseDuration;
    }
  }

  const totaltext = formatDuration(courseDuration, language);
  const descriptionBlocks = JSON.parse(description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");
  return (
    <div
      className="bg-white overflow-hidden pb-1 dark:bg-gray-800 rounded-[40px] shadow-md relative cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
      onClick={() => router.push(`/courses/${id}`)}
      title={isComplete ? t("courses.complete") : t("courses.startLearning")}
    >
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
      <p className="text-lg text-gray-500 px-4 font-semibold mb-2 truncate whitespace-nowrap overflow-hidden">
        {descriptionText || "وصف غير متوفر"}
      </p>

      {typeof courseDuration === "number" && (
        <div className="px-4 mb-2">
          {courseDuration > 0 ? (
            <Progress value={progressPercent * 100} />
          ) : (
            <div className="h-4 rounded-full bg-transparent opacity-0 pointer-events-none" />
          )}
        </div>
      )}

      {typeof progressPercent === "number" && (
        <div className="px-4 mb-2">
          {courseDuration > 0 ? (
            <div className="flex items-center gap-2">
              <Timer /> <p>{totaltext}</p>
            </div>
          ) : (
            <div className="h-4 rounded-full bg-transparent opacity-0 pointer-events-none" />
          )}
        </div>
      )}

      <div className="flex items-center absolute top-0 left-0 px-4 justify-between my-3">
        {onToggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(id);
            }}
            className="mr-2 text-blue-600 relative w-[40px] h-[40px] flex items-center justify-center 
                    rounded-full transition-all duration-300 
                    hover:bg-blue-100 dark:hover:bg-blue-900 
                    cursor-default"
            title={
              isBookmarked
                ? t("courses.remove_bookMark")
                : t("courses.save_bookMark")
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
