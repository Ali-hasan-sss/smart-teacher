"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourses } from "@/store/course/courseThunks";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { courses, loading, error } = useSelector(
    (state: RootState) => state.course
  );

  useEffect(() => {
    // جلب الكورسات عند تحميل الصفحة
    dispatch(fetchCourses({ pageNumber: 1, pageSize: 10 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t("courses.title")}
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            !error &&
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={
                      typeof course.title === "string"
                        ? course.title
                        : course.title?.en || "عنوان غير متوفر"
                    }
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                <h3 className="text-xl font-semibold mb-2">
                  {typeof course.title === "string"
                    ? course.title
                    : course.title?.en || "عنوان غير متوفر"}
                </h3>

                <div
                  onClick={() => router.push(`/courses/${course.id}`)} // الانتقال لصفحة تفاصيل الكورس
                  className="bg-blue-600 text-white px-4 py-2 rounded text-center cursor-pointer hover:bg-blue-700"
                >
                  {t("courses.startLearning")}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
