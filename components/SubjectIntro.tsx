"use client";

import { BookOpen, FileText, HelpCircle, ListChecks } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { AnimatePresence, motion } from "framer-motion";

interface SubjectIntroProps {
  subject: any;
  onSelect: (view: "lessons" | "quizzes" | "pdf" | "selfTest") => void;
}

export default function SubjectIntro({ subject, onSelect }: SubjectIntroProps) {
  const { t, language } = useTranslation();
  const dir = language === "ar" ? "rtl" : "ltr";

  const lessons = subject.courses.filter((c: any) => c.type === "Content");
  const quizzes = subject.courses.filter((c: any) => c.type === "Quiz");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="px-1 md:px-10 mx-auto p-6" dir={dir}>
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <img
              src={subject.image}
              alt={subject.title}
              className="w-full md:w-1/2 h-64 object-cover rounded-[40px] shadow"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{subject.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {subject.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("courses.lessonsCount")}: {lessons.length} |{" "}
                {t("courses.quizzesCount")}: {quizzes.length}
              </p>
            </div>
          </div>

          {/* ✅ مربعات الخيارات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* الدروس */}
            <div
              onClick={() => onSelect("lessons")}
              className="cursor-pointer p-6 rounded-2xl bg-secondary dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <BookOpen size={40} className="mb-3 text-blue-600" />
              <h3 className="font-bold">{t("courses.lessons")}</h3>
              <p className="text-sm text-gray-500">
                {lessons.length} {t("courses.items")}
              </p>
            </div>

            {/* الاختبارات */}
            <div
              onClick={() => onSelect("quizzes")}
              className="cursor-pointer p-6 rounded-2xl bg-secondary dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <ListChecks size={40} className="mb-3 text-green-600" />
              <h3 className="font-bold">{t("courses.quizzes")}</h3>
              <p className="text-sm text-gray-500">
                {quizzes.length} {t("courses.items")}
              </p>
            </div>

            {/* PDF */}
            {subject.pdfFile && (
              <div
                onClick={() => onSelect("pdf")}
                className="cursor-pointer p-6 rounded-2xl bg-secondary dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col items-center"
              >
                <FileText size={40} className="mb-3 text-red-600" />
                <h3 className="font-bold">{t("courses.pdfFile")}</h3>
                <p className="text-sm text-gray-500">{t("courses.viewPDF")}</p>
              </div>
            )}

            {/* اختبر معلوماتي */}
            <div
              onClick={() => onSelect("selfTest")}
              className="cursor-pointer p-6 rounded-2xl bg-secondary dark:bg-gray-900 shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <HelpCircle size={40} className="mb-3 text-purple-600" />
              <h3 className="font-bold">{t("courses.selfTest")}</h3>
              <p className="text-sm text-gray-500">
                {lessons.length} {t("courses.questions")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
