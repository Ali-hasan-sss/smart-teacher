import { Grade } from "@/types/grade";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

interface gradeCardProps {
  grade: Grade;
}

export default function GradeCard({ grade }: gradeCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      whileHover={{
        scale: 1.01,
      }}
    >
      <div
        className="w-[300px] flex flex-col items-center gap-2 bg-white dark:bg-primary p-5 rounded-lg shadow"
        key={grade.id}
      >
        <div
          className={`w-[60px] h-[60px] flex items-center justify-center rounded-full bg-green-100`}
        >
          <GraduationCap className="text-green-600" />
        </div>

        <h3 className="text-xl font-bold">{grade.title}</h3>

        <p className={`text-xs text-center text-gray-600 dark:text-gray-400`}>
          {t("grade.firstSemester")}: {grade.firstSemesterPrice}
        </p>
        <p className={`text-xs text-center text-gray-600 dark:text-gray-400`}>
          {t("grade.secondSemester")}: {grade.secondSemesterPrice}
        </p>

        <Link
          href={`/subjects?grade=${grade.id}`}
          className="mt-3 w-full bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg text-center transition"
        >
          {t("grade.browseSubjects")}
        </Link>
      </div>
    </motion.div>
  );
}
