"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/cards/CourseCard";
import SubjectIntro from "@/components/SubjectIntro";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "@/store/bookmark/bookmarkThunks";
import { fetchSubscriptions } from "@/store/subscription/subscriptionThunks";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Home,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import QuizContainer from "@/components/quizzesContainer";
import { useRouter, useSearchParams } from "next/navigation";

interface CourseItem {
  id: number;
  bookmarked?: boolean;
  [key: string]: any;
}

export default function CoursesPage() {
  const { language, t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const [subject, setSubject] = useState<any | null>(null);
  const [view, setView] = useState<
    "intro" | "lessons" | "quizzes" | "pdf" | "selfTest"
  >("intro");
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الاشتراكات عند زيارة صفحة الدروس (للمستخدم المسجل) للتحقق من الصلاحية
  useEffect(() => {
    if (token) {
      dispatch(fetchSubscriptions());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedSubject");
      if (stored) {
        setSubject(JSON.parse(stored));
      }
    }
  }, []);

  // التعامل مع معامل view من URL
  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (
      viewParam &&
      ["lessons", "quizzes", "pdf", "selfTest"].includes(viewParam)
    ) {
      setView(
        viewParam as "intro" | "lessons" | "quizzes" | "pdf" | "selfTest",
      );
    }
  }, [searchParams]);

  if (!subject) return <p>لا توجد بيانات</p>;

  const lessons = subject.courses
    .filter((c: any) => c.type === "Content")
    .filter((c: any) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const quizzes = subject.courses
    .filter((c: any) => c.type === "Quiz")
    .filter((c: any) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const isBookmarked = (courseId: number) => {
    const course = subject.courses.find((c: CourseItem) => c.id === courseId);
    return course?.bookmarked === true;
  };

  const toggleBookmark = async (courseId: number) => {
    if (!subject) return;

    try {
      if (isBookmarked(courseId)) {
        await dispatch(removeBookmark(courseId.toString()));
      } else {
        await dispatch(addBookmark({ courseId: courseId.toString() }));
      }

      const updatedCourses = subject.courses.map((course: CourseItem) =>
        course.id === courseId
          ? { ...course, bookmarked: !isBookmarked(courseId) }
          : course,
      );

      setSubject({ ...subject, courses: updatedCourses });

      localStorage.setItem(
        "selectedSubject",
        JSON.stringify({ ...subject, courses: updatedCourses }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-12 pt-[100px] px-4 sm:px-6 lg:px-8">
      {/* مسار التنقل */}
      <div className="max-w-7xl mx-auto mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => router.push("/subjects")}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t("navigation.subjects")}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {subject?.title}
          </span>
          {view !== "intro" && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {view === "lessons" && t("courses.lessons")}
                {view === "quizzes" && t("courses.quizzes")}
                {view === "pdf" && t("courses.pdfFile")}
                {view === "selfTest" && t("courses.selfTest")}
              </span>
            </>
          )}
        </nav>
      </div>

      {view === "intro" && (
        <SubjectIntro subject={subject} onSelect={setView} />
      )}

      {(view === "lessons" || view === "quizzes") && (
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView("intro")}
              className="mb-4 px-4 flex fixed top-5 z-50 items-center gap-2 py-2 rounded bg-gray-200 dark:bg-gray-700"
            >
              {language === "ar" ? (
                <span className="flex items-center gap-2">
                  <ArrowRight /> رجوع
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ArrowLeft />
                  Back
                </span>
              )}
            </button>
            <div className="mb-6 flex items-center w-full max-w-md mx-auto">
              <Search className="absolute mx-4 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(view === "lessons" ? lessons : quizzes).map((course: any) => (
              <CourseCard
                key={course.id}
                id={course.id}
                image={course.image}
                title={course.title}
                description={course.description}
                duration={course.duration}
                courseDuration={course.courseDuration}
                courseFile={course.courseFile}
                gradeId={course.gradetId}
                subjectId={course.subjectId ?? subject?.id}
                isFree={course.isFree}
                isBookmarked={course.bookmarked}
                onToggleBookmark={() => toggleBookmark(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {view === "pdf" && (
        <div>
          <button
            onClick={() => setView("intro")}
            className="mb-4 px-4 flex fixed top-5 z-50 items-center gap-2 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {language === "ar" ? (
              <span className="flex items-center gap-2">
                <ArrowRight /> رجوع
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowLeft />
                Back
              </span>
            )}
          </button>
          <iframe
            src={subject.pdfFile}
            className="w-full h-[80vh] rounded-lg shadow"
          />
        </div>
      )}

      {view === "selfTest" && (
        <div>
          <button
            onClick={() => setView("intro")}
            className="mb-4 px-4 flex fixed top-5 z-50 items-center gap-2 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {language === "ar" ? (
              <span className="flex items-center gap-2">
                <ArrowRight /> رجوع
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowLeft />
                Back
              </span>
            )}
          </button>
          <QuizContainer courses={lessons} />
        </div>
      )}
    </div>
  );
}
