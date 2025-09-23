"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import CourseCard from "@/components/cards/CourseCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AppDispatch, RootState } from "@/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoaderCard from "@/components/loaders/LoaderCard";
import SearchCTA from "@/components/Cta/searchCTA";
import CTA from "@/components/Cta/CTA";
import HowItWork from "@/components/howItWork";
import Hero from "@/components/hero";
import CourseType from "@/components/courseType";
import { isLoggedIn } from "@/store/auth/authSlice";
import Chat from "@/components/chat";
import {
  fetchClientHome,
  fetchTeacherHome,
  fetchParentHome,
} from "@/store/home/homeThunks";
import { HomeCourse, Subject } from "@/types/home";
import SubjectCard, { SubjectCardProps } from "@/components/cards/SubjectCard";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ParentProgressSection from "@/components/parent/ParentProgressSection";
import {
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  BarChart3,
  Target,
  Award,
} from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const loggedIn = useSelector(isLoggedIn);
  const accountType = useSelector(
    (state: RootState) => state.auth.user?.accountType
  );
  const {
    clientData,
    teacherData,
    parentData,
    loading,
    teacherLoading,
    parentLoading,
    error,
    teacherError,
    parentError,
  } = useSelector((s: RootState) => s.home);

  useEffect(() => {
    // جلب البيانات حسب نوع الحساب
    if (loggedIn && accountType) {
      if (accountType === "Client") {
        dispatch(fetchClientHome());
      } else if (accountType === "Teacher") {
        dispatch(fetchTeacherHome());
      } else if (accountType === "Parent") {
        dispatch(fetchParentHome());
      }
    }
  }, [dispatch, loggedIn, accountType]);

  const startStudy = (subject: SubjectCardProps["subject"]) => {
    localStorage.setItem("selectedSubject", JSON.stringify(subject));
    router.push("/courses");
  };

  // تحديد البيانات والتحميل حسب نوع الحساب
  const getCurrentData = () => {
    if (accountType === "Client") {
      return {
        data: clientData,
        loading: loading,
        error: error,
        lastCourses: clientData?.lastCourses || [],
        subjects: clientData?.subjects || [],
      };
    } else if (accountType === "Teacher") {
      return {
        data: teacherData,
        loading: teacherLoading,
        error: teacherError,
        lastCourses: teacherData?.lastCourses || [],
        subjects: teacherData?.subjects || [],
      };
    } else if (accountType === "Parent") {
      return {
        data: parentData,
        loading: parentLoading,
        error: parentError,
        lastCourses: [],
        subjects: [],
      };
    }
    return {
      data: null,
      loading: false,
      error: null,
      lastCourses: [],
      subjects: [],
    };
  };

  const currentData = getCurrentData();

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <SearchCTA />
        </motion.div>

        <CourseType />

        {/* Guest User Section - Only for non-logged in users */}
        {!loggedIn && (
          <section className="py-10 bg-white dark:bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("homePage.startYourJourney")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("homePage.joinThousands")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Student Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("homePage.forStudents")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("homePage.forStudentsDesc")}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-right">
                    <li>
                      • {t("homePage.studentFeatures.interactiveLessons")}
                    </li>
                    <li>• {t("homePage.studentFeatures.smartTests")}</li>
                    <li>• {t("homePage.studentFeatures.progressTracking")}</li>
                    <li>• {t("homePage.studentFeatures.certificates")}</li>
                  </ul>
                </div>

                {/* Teacher Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("homePage.forTeachers")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("homePage.forTeachersDesc")}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-right">
                    <li>• {t("homePage.teacherFeatures.createContent")}</li>
                    <li>• {t("homePage.teacherFeatures.manageStudents")}</li>
                    <li>• {t("homePage.teacherFeatures.detailedReports")}</li>
                    <li>• {t("homePage.teacherFeatures.advancedTools")}</li>
                  </ul>
                </div>

                {/* Parent Card */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("homePage.forParents")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("homePage.forParentsDesc")}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-right">
                    <li>• {t("homePage.parentFeatures.trackProgress")}</li>
                    <li>• {t("homePage.parentFeatures.detailedGrades")}</li>
                    <li>
                      • {t("homePage.parentFeatures.manageSubscriptions")}
                    </li>
                    <li>• {t("homePage.parentFeatures.contactTeachers")}</li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => router.push("/plans")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  {t("homePage.startNow")}
                </button>
              </div>
            </div>
          </section>
        )}

        {loggedIn && (
          <>
            {/* complete Section - Only for Client and Teacher */}
            {accountType !== "Parent" && (
              <section className="py-10 bg-white dark:bg-secondary ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      {t("homePage.complete")}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                      {t("homePage.complete_description")}
                    </p>
                  </div>

                  <div className="relative w-full">
                    {currentData.loading ? (
                      <div className="flex justify-center">
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-400">
                            جاري تحميل الكورسات...
                          </p>
                        </div>
                      </div>
                    ) : currentData.error ? (
                      <div className="text-center py-8">
                        <p className="text-red-600 dark:text-red-400">
                          {currentData.error}
                        </p>
                      </div>
                    ) : (
                      <Carousel className="w-full overflow-hidden" dir="ltr">
                        <CarouselContent className="overflow-visible">
                          {currentData.lastCourses?.map(
                            (course: HomeCourse) => (
                              <CarouselItem
                                key={course.id}
                                className="md:basis-1/2 lg:basis-1/3"
                              >
                                <CourseCard
                                  id={course.id}
                                  gradeId={course.gradetId}
                                  isFree={course.isFree}
                                  title={course.title}
                                  image={course.image}
                                  duration={course.duration}
                                  courseDuration={
                                    course.courseDuration || 30 * 60
                                  }
                                  description={course.description}
                                />
                              </CarouselItem>
                            )
                          )}
                        </CarouselContent>

                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
                      </Carousel>
                    )}
                  </div>
                </div>
              </section>
            )}
            {/* recommended Section - Only for Client and Teacher */}
            {accountType !== "Parent" &&
              (currentData.subjects?.length ?? 0) > 0 && (
                <section className="py-10 bg-white dark:bg-secondary ">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("homePage.recommended")}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        {t("homePage.recommended_description")}
                      </p>
                    </div>

                    <div className="relative w-full">
                      <Carousel className="w-full overflow-hidden" dir="ltr">
                        <CarouselContent className="overflow-visible">
                          {currentData.loading
                            ? Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem
                                  key={index}
                                  className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                                >
                                  <div className="w-[300px]">
                                    <LoaderCard />
                                  </div>
                                </CarouselItem>
                              ))
                            : currentData.subjects?.map((subject: Subject) => (
                                <CarouselItem
                                  key={subject.id}
                                  className="flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex justify-center"
                                >
                                  <div className="w-[300px]">
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
                                  </div>
                                </CarouselItem>
                              ))}
                        </CarouselContent>

                        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
                      </Carousel>
                    </div>
                  </div>
                </section>
              )}

            {/* Parent Progress Section - Only for Parent */}
            {accountType === "Parent" && parentData && (
              <ParentProgressSection
                children={parentData.children || []}
                subscriptions={parentData.subscriptions || []}
              />
            )}
          </>
        )}
        <div className="py-10 bg-white dark:bg-secondary  px-1 md:px-10 text-white">
          <CTA />
        </div>
        <HowItWork />
        <Chat />
      </AnimatePresence>
    </div>
  );
}
