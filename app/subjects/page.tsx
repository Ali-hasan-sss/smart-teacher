"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchSubjects } from "@/store/subject/subjectThunk";
import { fetchSubscriptions } from "@/store/subscription/subscriptionThunks";
import { useTranslation } from "@/hooks/useTranslation";
import SubjectCard, { SubjectCardProps } from "@/components/cards/SubjectCard";
import LoaderPage from "@/components/loaders/LoaderPage";
import Chat from "@/components/chat";
import GradeSelect from "@/components/forms/GradeSelect";
import PaginationComponent from "@/components/pagination";
import SearchBar from "@/components/forms/SearchBar";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";
export default function SubjectsList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const { items, totalPages, loading, error } = useSelector(
    (state: RootState) => state.subjects,
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const gradeIdFromParams = searchParams.get("grade");
  const initialGradeId = gradeIdFromParams
    ? Number(gradeIdFromParams)
    : user?.grade?.id;
  const [selectedGrade, setSelectedGrade] = useState<number | null>(
    initialGradeId,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState<"first" | "second">(
    "first",
  );

  useEffect(() => {
    if (selectedGrade) {
      dispatch(
        fetchSubjects({ gradeId: selectedGrade, pageNumber: currentPage }),
      );
    }
  }, [selectedGrade, currentPage, dispatch, language]);

  // جلب الاشتراكات عند زيارة صفحة المواد (للمستخدم المسجل) للتحقق من صلاحية الدخول للدروس
  useEffect(() => {
    if (token) {
      dispatch(fetchSubscriptions());
    }
  }, [token, dispatch]);

  const startStudy = (subject: SubjectCardProps["subject"]) => {
    localStorage.setItem("selectedSubject", JSON.stringify(subject));

    router.push("/courses");
  };

  // فلترة المواد حسب الفصل المختار
  const filteredSubjects = useMemo(() => {
    return items.filter((subject) => {
      // إذا لم يكن هناك semester أو كان فارغاً، افتراضياً تعتبر الفصل الأول
      const semester = subject.semester?.toLowerCase() || "first";

      if (selectedSemester === "first") {
        // عرض الفصل الأول + المواد التي لا تحتوي على semester
        return (
          semester === "first" || !subject.semester || subject.semester === ""
        );
      } else {
        // عرض الفصل الثاني فقط
        return semester === "second";
      }
    });
  }, [items, selectedSemester]);

  if (loading) return <LoaderPage />;

  // إذا لم يتم اختيار صف، اعرض رسالة
  if (!selectedGrade) {
    return (
      <div className="min-h-screen pt-[100px] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("subjects.select_grade_title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("subjects.select_grade_message")}
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <GradeSelect
              value={selectedGrade}
              onChange={(value) => {
                setSelectedGrade(Number(value));
                setCurrentPage(1);
              }}
              placeholder={t("subjects.choose_grade")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="min-h-screen pt-[100px] py-12 px-4 sm:px-6 lg:px-8">
          <Chat />
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col py-10 md:flex-row md:items-center md:justify-between gap-3 mb-8">
              {/* العنوان */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white w-full md:w-1/3">
                {t("subjects.title")}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-2/3">
                <div className="w-full md:flex-1">
                  <SearchBar
                    api={`/api/Client/Subject?&GradetId=${selectedGrade}&title=`}
                    isSubject
                  />
                </div>

                <div className="w-full md:w-1/3">
                  <GradeSelect
                    value={selectedGrade}
                    onChange={(value) => {
                      setSelectedGrade(Number(value));
                      setCurrentPage(1);
                    }}
                    placeholder="اختر الصف الدراسي"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* تابين الفصل الدراسي */}
            <div className="mb-6">
              <Tabs
                value={selectedSemester}
                onValueChange={(value) =>
                  setSelectedSemester(value as "first" | "second")
                }
                className="w-full"
              >
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="first" className="text-base">
                    {t("subjects.first_semester") || "الفصل الأول"}
                  </TabsTrigger>
                  <TabsTrigger value="second" className="text-base">
                    {t("subjects.second_semester") || "الفصل الثاني"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={{
                      id: subject.id,
                      title: subject.title,
                      description: subject.description,
                      coursesCount: subject.coursesCount,
                      image: subject.image,
                      pdfFile: subject.pdfFile,
                      courses: subject.courses,
                    }}
                    onStartStudy={() => startStudy(subject)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("subjects.no_subjects_found") || "لا توجد مواد"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("subjects.no_subjects_message") ||
                      "لا توجد مواد متاحة للفصل المختار"}
                  </p>
                </div>
              )}
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
      </motion.div>
    </AnimatePresence>
  );
}
