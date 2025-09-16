import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { addBookmark, removeBookmark } from "@/store/bookmark/bookmarkThunks";
import { useAppDispatch } from "@/store/hooks";
import { Course } from "@/types/course";
import { formatDuration } from "@/utils/formatDuration";
import { BookOpen, Folder, Timer } from "lucide-react";
import { useSelector } from "react-redux";

interface CourseEntrayProps {
  onStart: () => void;
  selectedCourse: Course;
  dir: "rtl" | "ltr";
  isbookMark: boolean;
  descriptionText: string;
}
function renderDescription(desc: string) {
  try {
    const ops = JSON.parse(desc);
    const listItems: JSX.Element[] = [];
    const normalText: JSX.Element[] = [];

    ops.forEach((op: any, idx: number) => {
      if (op.insert) {
        // فك النص إلى أسطر (بناءً على \n أو •)
        const parts = op.insert
          .split(/\n/) // قسم بالسطر
          .map((p: string) => p.trim())
          .filter((p: string) => p.length > 0);

        parts.forEach((part: string, i: number) => {
          if (part.startsWith("•")) {
            const cleanText = part.replace(/^[•\s\t]+/, "").trim();
            if (cleanText)
              listItems.push(
                <li key={`${idx}-${i}`} className="mb-1 leading-relaxed">
                  {cleanText}
                </li>
              );
          } else {
            normalText.push(
              <p key={`${idx}-${i}`} className="mb-2 leading-relaxed">
                {part}
              </p>
            );
          }
        });
      }
    });

    return (
      <div className="w-full">
        {normalText.length > 0 && (
          <div className="space-y-2 mb-3">{normalText}</div>
        )}
        {listItems.length > 0 && (
          <ul
            className="space-y-2 w-full"
            style={{
              listStyleType: "disc",
              paddingInlineStart: "1.5rem",
              marginInlineStart: "0",
              marginInlineEnd: "0",
            }}
          >
            {listItems}
          </ul>
        )}
      </div>
    );
  } catch {
    return <p className="leading-relaxed">{desc}</p>;
  }
}

export default function CourseEntray({
  onStart,
  selectedCourse,
  dir,
  isbookMark,
  descriptionText,
}: CourseEntrayProps) {
  const { t, language } = useTranslation();
  const total = selectedCourse.courseDuration || 30 * 60;
  const totaltext = formatDuration(total, language);
  const dispatch = useAppDispatch();
  const { toggleLoading } = useSelector((state: RootState) => state.bookmark);

  const toggleBookmark = async () => {
    if (isbookMark)
      await dispatch(addBookmark({ courseId: selectedCourse.id.toString() }));
    else await dispatch(removeBookmark(`${selectedCourse.id}`));
  };

  return (
    <div
      className="px-2 sm:px-4 md:px-6 lg:px-10 mx-auto p-4 sm:p-6 pt-[80px] md:pt-[120px] lg:pt-[150px]"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center"
          dir="rtl"
        >
          <img
            src={selectedCourse.image}
            alt="صورة الكورس"
            className="w-full lg:w-1/2 h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] shadow-lg"
          />
          <div className="flex-1 w-full" dir="rtl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              {selectedCourse.title}
            </h1>

            <div className="flex flex-col gap-3 mb-4 text-sm text-gray-500">
              {selectedCourse.duration && selectedCourse.type !== "Quiz" && (
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {t("courses.duration_label")}: {totaltext}
                  </span>
                </div>
              )}
              {selectedCourse.sections &&
                selectedCourse.sections.length > 0 &&
                selectedCourse.type !== "Quiz" && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {t("courses.sections_count")}:{" "}
                      {selectedCourse.sections.length}
                    </span>
                  </div>
                )}
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 flex-shrink-0" />
                <span>
                  {t("courses.type_label")}:{" "}
                  {t(`courses.course_types.${selectedCourse.type}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary w-full flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 py-6 sm:py-8 lg:py-10 mt-6 sm:mt-8 lg:mt-10 rounded-[15px] sm:rounded-[20px]">
          <div className="flex flex-col w-full rounded-lg bg-white dark:bg-gray-900">
            {/* ✅ وصف الدرس */}
            {descriptionText && (
              <div className="mb-4 text-sm text-gray-700 py-4 px-3 md:px-5 dark:text-gray-300 border-t pt-4">
                <h2 className="text-base font-semibold mb-3">
                  {t("courses.course_description")}:
                </h2>
                <div className="text-sm md:text-base py-2 overflow-hidden">
                  {renderDescription(descriptionText)}
                </div>
              </div>
            )}

            {/* ✅ قائمة الأقسام */}
            {selectedCourse.sections && selectedCourse.sections.length > 0 && (
              <div className="px-3 md:px-5 py-3 gap-3 flex flex-wrap w-full">
                {selectedCourse.sections
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => {
                    // استخراج الصورة
                    let cover: string | null = null;
                    try {
                      if (section.content && section.type === "Pdf") {
                        const parsed = JSON.parse(section.content);
                        cover = parsed.cover || null;
                      }
                    } catch {}

                    const imageUrl =
                      cover || section.course.image || selectedCourse.image;
                    const title =
                      section.title || `${t("courses.section")} ${index + 1}`;

                    return (
                      <div
                        key={section.id}
                        className="flex w-full sm:w-[250px] p-3 rounded-lg items-center gap-3 bg-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={imageUrl}
                          className="rounded-lg w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                          alt={title}
                        />
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <span className="font-medium text-sm">
                            {t("courses.section")} {index + 1}:
                          </span>
                          {section.title && (
                            <span className="italic text-xs text-gray-600 dark:text-gray-400 truncate">
                              {t("courses.title_label")}: {title}
                            </span>
                          )}
                          <span className="italic text-xs text-gray-600 dark:text-gray-400">
                            {t("courses.type_label")}:{" "}
                            {t(`courses.section_types.${section.type}`)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="flex w-full md:w-[350px] h-auto md:h-[150px] flex-col items-center justify-center gap-3 p-4 rounded-[20px] bg-white dark:bg-gray-900">
            <button
              onClick={onStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
            >
              {t("courses.start_studying")}
            </button>
            <button
              onClick={toggleBookmark}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
            >
              {toggleLoading
                ? "loading..."
                : isbookMark
                ? t("courses.remove_bookMark")
                : t("courses.save_bookMark")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
