"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourses } from "@/store/course/courseThunks";
import { addBookmark, removeBookmark } from "@/store/bookmark/bookmarkThunks";
import CourseCard from "@/components/CourseCard";
import PaginationComponent from "@/components/pagination";
import LoaderPage from "@/components/loaders/LoaderPage";
import { FetchCoursesParams } from "@/types/course";

export default function CoursesPage() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const subjectId = localStorage.getItem("selectedSubject");
  const { courses, totalPages, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const [currentPage, setCurrentPage] = useState(1);
  const isBookmarked = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.bookmarked === true;
  };

  const toggleBookmark = (courseId: number) => {
    if (isBookmarked(courseId)) {
      dispatch(removeBookmark(`${courseId}`)).then(() => {
        const updatedCourses = courses.map((course) =>
          course.id === courseId ? { ...course, bookmarked: false } : course
        );
        dispatch({ type: "course/setCourses", payload: updatedCourses });
      });
    } else {
      dispatch(addBookmark({ courseId: courseId.toString() })).then(() => {
        const updatedCourses = courses.map((course) =>
          course.id === courseId ? { ...course, bookmarked: true } : course
        );
        dispatch({ type: "course/setCourses", payload: updatedCourses });
      });
    }
  };

  useEffect(() => {
    const pageParams: FetchCoursesParams = {
      pageNumber: 1,
      pageSize: 10,
    };

    if (subjectId) {
      pageParams.subjectId = Number(subjectId);
    }

    dispatch(fetchCourses(pageParams));
  }, [dispatch, subjectId, currentPage, language]);

  if (loading) return <LoaderPage />;
  return (
    <div className="min-h-screen py-12 pt-[100px]  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t("courses.title")}
        </h1>

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
                duration={course.duration}
              />
            ))}
        </div>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
}
