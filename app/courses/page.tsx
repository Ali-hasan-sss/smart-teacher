"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourses } from "@/store/course/courseThunks";
import { addBookmark, removeBookmark } from "@/store/bookmark/bookmarkThunks";
import CourseCard from "@/components/CourseCard";

export default function CoursesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const subjectId = localStorage.getItem("selectedSubject");
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.course
  );

  const isBookmarked = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.bookmarked === true;
  };

  const toggleBookmark = (courseId: number) => {
    if (isBookmarked(courseId)) {
      dispatch(removeBookmark(`${courseId}`));
    } else {
      dispatch(addBookmark({ courseId: courseId.toString() }));
    }
  };

  useEffect(() => {
    dispatch(
      fetchCourses({
        pageNumber: 1,
        pageSize: 10,
        subjectId: Number(subjectId),
      })
    );
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
              <CourseCard
                key={course.id}
                id={course.id}
                image={course.image}
                title={course.title || "عنوان غير متوفر"}
                isBookmarked={course.bookmarked}
                onToggleBookmark={toggleBookmark}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
