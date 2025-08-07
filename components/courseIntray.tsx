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
      className="px-1 md:px-10 mx-auto p-6 pt-[80px] md:pt-[150px]"
      dir={dir}
    >
      <div>
        <div
          className="flex flex-col md:flex-row  gap-10 items-center"
          dir="rtl"
        >
          <img
            src={selectedCourse.image}
            alt="صورة الكورس"
            className="w-full md:w-1/2 h-64 object-cover rounded-[40px] shadow"
          />
          <div className="flex-1" dir="rtl">
            <h1 className="text-2xl font-bold mb-2">{selectedCourse.title}</h1>

            <div className="flex flex-col gap-4 mb-4 text-sm text-gray-500">
              {selectedCourse.duration && (
                <div className="flex items-center gap-2">
                  <Timer /> مدة الدرس: {totaltext}
                </div>
              )}
              {selectedCourse.sections && (
                <div className="flex items-center gap-2">
                  <BookOpen /> عدد الأقسام: {selectedCourse.sections.length}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Folder /> النوع: {selectedCourse.type}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary w-full flex flex-col md:flex-row  gap-5  px-6 py-10 mt-10 rounded-[20px]">
          <div className="flex flex-col w-full rounded-lg bg-white dark:bg-gray-900">
            {/* ✅ قائمة الأقسام */}
            {selectedCourse.sections && (
              <div className="mb-4 text-sm text-gray-700 py-5 px-1 md:px-5 dark:text-gray-300 border-t pt-4">
                <h2 className="text-base font-semibold mb-2">وصف الدرس:</h2>
                <p className="text-lg py-5">{descriptionText}</p>
                <div className=" px-5 gap-2 flex flex-wrap w-full">
                  {selectedCourse.sections
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <div
                        key={section.id}
                        className="flex  w-[300px] p-3 rounded-lg items-center gap-1 bg-secondary"
                      >
                        <img
                          src={section.course.image}
                          className="rounded-lg w-20 h-20"
                          alt={section.title}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            القسم {index + 1}:
                          </span>{" "}
                          <span className="italic">
                            العنوان :{section.title}
                          </span>
                          <span className="italic">
                            {" "}
                            النوع : {section.type}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex  md:w-[350px] h-[150px] flex-col items-cente justify-center gap-2 p-4 rounded-[20px] bg-white dark:bg-gray-900">
            <button
              onClick={onStart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg"
            >
              ابدأ الدراسة الآن
            </button>
            <button
              onClick={toggleBookmark}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg"
            >
              {toggleLoading
                ? "loadind..."
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
