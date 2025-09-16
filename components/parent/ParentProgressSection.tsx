"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import TestResultsModal from "@/components/TestResultsModal";

interface Child {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  grades?: Grade[];
  subscriptions?: Subscription[];
}

interface Grade {
  id: number;
  title: string;
  subjects?: Subject[];
}

interface Subject {
  id: number;
  title: string;
  image: string;
  coursesCount: number;
  courses?: Course[];
}

interface Course {
  id: number;
  title: string;
  results?: string[];
}

interface Subscription {
  id: number;
  cost: number;
  expireAt: string;
  semester?: string | null;
  plan?: {
    title: string;
  } | null;
  account: {
    firstName: string;
    lastName: string;
  };
  grade: {
    title: string;
  };
}

interface ParentProgressSectionProps {
  children: any[];
  subscriptions: any[];
}

export default function ParentProgressSection({
  children,
  subscriptions,
}: ParentProgressSectionProps) {
  const { t } = useTranslation();

  // Test Results Modal State
  const [testResultsModal, setTestResultsModal] = useState({
    isOpen: false,
    testResults: [] as any[],
    subjectTitle: "",
    courseTitle: "",
    totalScore: 0,
    maxScore: 0,
    testDate: "",
  });

  const openTestResults = (
    testResults: any[],
    subjectTitle: string,
    courseTitle: string
  ) => {
    // Parse test results from the results field
    let allQuestions: any[] = [];

    testResults.forEach((result) => {
      try {
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          allQuestions = allQuestions.concat(parsed);
        } else {
          allQuestions.push(parsed);
        }
      } catch (error) {
        console.error("Error parsing test result:", error);
      }
    });

    const parsedResults = allQuestions.map((question, index) => {
      return {
        id: question.id || index + 1,
        question: question.question || `سؤال ${index + 1}`,
        correctAnswer: question.correctAnswer || "إجابة صحيحة",
        options: Array.isArray(question.options)
          ? question.options
          : ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
        answer: question.answer || "إجابة الطالب",
      };
    });

    const correctAnswers = parsedResults.filter(
      (result) => result.answer === result.correctAnswer
    ).length;

    setTestResultsModal({
      isOpen: true,
      testResults: parsedResults,
      subjectTitle,
      courseTitle,
      totalScore: correctAnswers,
      maxScore: parsedResults.length,
      testDate: new Date().toLocaleDateString("ar-SA"),
    });
  };

  if (!children || children.length === 0) {
    return null;
  }

  return (
    <>
      {/* Parent Children Section */}
      <section className="py-10 bg-white dark:bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("parentProgress.yourChildren")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("parentProgress.childrenDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {child.firstName?.[0]}
                    {child.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {child.email}
                    </p>
                    {child.phoneNumber && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {child.phoneNumber}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {child.grades?.map((grade: any) => (
                        <span
                          key={grade.id}
                          className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                        >
                          {grade.title}
                        </span>
                      ))}
                    </div>
                    {child.subscriptions && child.subscriptions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {child.subscriptions.length}{" "}
                          {t("parentProgress.activeSubscriptions")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Children Progress Section */}
      <section className="py-10 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("parentProgress.childrenProgress")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("parentProgress.progressDescription")}
            </p>
          </div>

          <div className="space-y-8">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {child.firstName?.[0]}
                    {child.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {child.email}
                    </p>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📚</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("parentProgress.completedLessons")}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {child.grades?.reduce(
                            (total: any, grade: any) =>
                              total +
                              (grade.subjects?.reduce(
                                (subTotal: any, subject: any) =>
                                  subTotal + (subject.courses?.length || 0),
                                0
                              ) || 0),
                            0
                          ) || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎯</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("parentProgress.averageGrades")}
                        </p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          85%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⏱️</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("parentProgress.studyHours")}
                        </p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          24
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects Progress */}
                {child.grades && child.grades.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {t("parentProgress.subjectsProgress")}
                    </h4>
                    <div className="space-y-4">
                      {child.grades.map((grade: any) => (
                        <div
                          key={grade.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {grade.title}
                            </h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {grade.subjects?.length || 0}{" "}
                              {t("parentProgress.subjects")}
                            </span>
                          </div>

                          {grade.subjects && grade.subjects.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {grade.subjects.map((subject: any) => (
                                <div
                                  key={subject.id}
                                  className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <img
                                      src={subject.image}
                                      alt={subject.title}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                    <h6 className="font-medium text-gray-900 dark:text-white text-sm">
                                      {subject.title}
                                    </h6>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                      <span>
                                        {t("parentProgress.completedLessons")}
                                      </span>
                                      <span>
                                        {subject.courses?.length || 0}{" "}
                                        {t("parentProgress.of")}{" "}
                                        {subject.coursesCount}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                          width: `${
                                            ((subject.courses?.length || 0) /
                                              subject.coursesCount) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                    {/* آخر اختبار - النسبة المئوية */}
                                    <div className="flex justify-between text-xs items-center mb-2">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {t("parentProgress.lastTest")}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {(() => {
                                          const courseWithResults =
                                            subject.courses?.find(
                                              (course: any) =>
                                                course.results &&
                                                Array.isArray(course.results) &&
                                                course.results.length > 0
                                            );
                                          if (
                                            courseWithResults &&
                                            (courseWithResults as any).results
                                          ) {
                                            try {
                                              const results = (
                                                courseWithResults as any
                                              ).results.map((result: string) =>
                                                JSON.parse(result)
                                              );
                                              const correctAnswers =
                                                results.filter(
                                                  (result: any) =>
                                                    result.answer ===
                                                    result.correctAnswer
                                                ).length;
                                              const percentage = Math.round(
                                                (correctAnswers /
                                                  results.length) *
                                                  100
                                              );
                                              return (
                                                <div className="flex items-center gap-1">
                                                  <span
                                                    className={`font-medium ${
                                                      percentage >= 80
                                                        ? "text-green-600 dark:text-green-400"
                                                        : percentage >= 60
                                                        ? "text-yellow-600 dark:text-yellow-400"
                                                        : "text-red-600 dark:text-red-400"
                                                    }`}
                                                  >
                                                    {percentage}%
                                                  </span>
                                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({correctAnswers}/
                                                    {results.length})
                                                  </span>
                                                </div>
                                              );
                                            } catch {
                                              return (
                                                <span className="text-gray-500 dark:text-gray-400 font-medium">
                                                  {t(
                                                    "parentProgress.noResults"
                                                  )}
                                                </span>
                                              );
                                            }
                                          }
                                          return (
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                                              {t("parentProgress.noResults")}
                                            </span>
                                          );
                                        })()}
                                      </div>
                                    </div>

                                    {/* زر عرض النتائج */}
                                    {subject.courses &&
                                      subject.courses.length > 0 &&
                                      subject.courses.some(
                                        (course: any) =>
                                          (course as any).results &&
                                          Array.isArray(
                                            (course as any).results
                                          ) &&
                                          (course as any).results.length > 0
                                      ) && (
                                        <div className="flex justify-center">
                                          <button
                                            onClick={() => {
                                              const courseWithResults =
                                                subject.courses.find(
                                                  (course: any) =>
                                                    (course as any).results &&
                                                    Array.isArray(
                                                      (course as any).results
                                                    ) &&
                                                    (course as any).results
                                                      .length > 0
                                                );

                                              if (courseWithResults) {
                                                openTestResults(
                                                  (courseWithResults as any)
                                                    .results,
                                                  subject.title,
                                                  (courseWithResults as any)
                                                    .title
                                                );
                                              }
                                            }}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors font-medium"
                                          >
                                            {t(
                                              "parentProgress.viewDetailedResults"
                                            )}
                                          </button>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Subscriptions Section */}
      {subscriptions && subscriptions.length > 0 && (
        <section className="py-10 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("parentProgress.activeSubscriptions")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("parentProgress.subscriptionsDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {subscription.account.firstName?.[0]}
                      {subscription.account.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {subscription.account.firstName}{" "}
                        {subscription.account.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscription.grade.title}
                      </p>
                    </div>
                  </div>

                  {subscription.plan && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                        {subscription.plan.title}
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      {t("parentProgress.cost")}: {subscription.cost}{" "}
                      {t("parentProgress.currency")}
                    </p>
                    <p>
                      {t("parentProgress.expiresAt")}:{" "}
                      {new Date(subscription.expireAt).toLocaleDateString(
                        "ar-SA"
                      )}
                    </p>
                    {subscription.semester && (
                      <p>
                        {t("parentProgress.semester")}:{" "}
                        {subscription.semester === "First"
                          ? t("parentProgress.firstSemester")
                          : t("parentProgress.secondSemester")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Test Results Modal */}
      <TestResultsModal
        isOpen={testResultsModal.isOpen}
        onClose={() =>
          setTestResultsModal((prev) => ({ ...prev, isOpen: false }))
        }
        testResults={testResultsModal.testResults}
        subjectTitle={testResultsModal.subjectTitle}
        courseTitle={testResultsModal.courseTitle}
        totalScore={testResultsModal.totalScore}
        maxScore={testResultsModal.maxScore}
        testDate={testResultsModal.testDate}
      />
    </>
  );
}
