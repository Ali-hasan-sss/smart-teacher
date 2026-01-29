"use client";

import { Bookmark, FileText, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Progress } from "../ui/progress";
import { formatDuration } from "@/utils/formatDuration";
import { motion } from "framer-motion";
import { canAccessCourse } from "@/utils/getActiveSubscription";
import { trackCourseView } from "@/utils/gtm";

interface CourseCardProps {
  id: number;
  image?: string;
  title: string;
  gradeId: number;
  /** معرف المادة التابع لها الدرس (للتحقق من اشتراك حسب المادة) */
  subjectId?: number;
  isFree: boolean;
  description: string;
  isBookmarked?: boolean;
  onToggleBookmark?: (courseId: number) => void;
  toggleLoading?: boolean;
  duration: number;
  courseDuration: number;
  courseFile?: string;
}

export default function CourseCard({
  id,
  image,
  title,
  gradeId,
  subjectId,
  isFree,
  description,
  isBookmarked,
  courseFile,
  onToggleBookmark,
  duration,
  courseDuration,
}: CourseCardProps) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { toggleLoading } = useSelector((state: RootState) => state.bookmark);
  const subscriptions = useSelector(
    (state: RootState) => state.subscription.items || [],
  );

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

  const handleCardClick = () => {
    // تتبع عرض الكورس
    trackCourseView(id, title, isFree);

    if (isFree) {
      router.push(`/courses/${id}`);
      return;
    }

    const isSubscribed = canAccessCourse(
      subscriptions || [],
      gradeId,
      subjectId,
    );

    if (isSubscribed) {
      router.push(`/courses/${id}`);
    } else {
      // المستخدم غير مشترك والدرس غير مجاني -> تحويل إلى صفحة الخطط
      if (typeof window !== "undefined") {
        // حفظ رابط العودة بعد إتمام الاشتراك
        localStorage.setItem("subscriptionReturnPath", `/courses/${id}`);
        // حفظ الصف الذي يتبع له الدرس
        if (gradeId) {
          localStorage.setItem("subscriptionGradeId", String(gradeId));
        }
      }
      router.push("/plans");
    }
  };

  const totaltext = formatDuration(courseDuration, language);
  const descriptionBlocks = JSON.parse(description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      whileHover={{
        scale: 1.01,
      }}
    >
      <div
        className="bg-third overflow-hidden pb-1 rounded-[40px] shadow-md relative cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
        onClick={handleCardClick}
        title={isComplete ? t("courses.complete") : t("courses.startLearning")}
      >
        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-1">
              <span className="text-xs">🆓</span>
              <span>{t("courses.free")}</span>
            </div>
          </div>
        )}
        {image && (
          <img
            src={image}
            alt={title || "عنوان غير متوفر"}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <div className="flex items-center px-4 justify-between mb-2">
          <h3 className="text-xl font-semibold">
            {title || "عنوان غير متوفر"}
          </h3>
          {courseFile && (
            <a
              href={courseFile}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 flex items-center gap-1 cursor-pointer dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              title={t("courses.downloadMaterial")}
            >
              <FileText size={20} />
              <span className="mt-1">PDF</span>
            </a>
          )}
        </div>
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
              className="mr-2 text-blue-700 relative w-[40px] h-[40px] flex items-center justify-center 
                    rounded-full transition-all duration-300 
                    hover:bg-blue-600 dark:hover:bg-blue-900 
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
                  <Bookmark
                    size={35}
                    fill={isBookmarked ? "#2563eb" : "none"}
                  />
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
