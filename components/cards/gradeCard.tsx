import { Grade } from "@/types/grade";
import { GraduationCap } from "lucide-react";

interface gradeCardProps {
  grade: Grade;
}

export default function GradeCard({ grade }: gradeCardProps) {
  return (
    <div
      className="w-[200px]  flex flex-col items-center gap-1 bg-white dark:bg-primary p-5 rounded-lg"
      key={grade.id}
    >
      <div
        className={`w-[60px] h-[60px] flex items-center justify-center rounded-full bg-green-100`}
      >
        <GraduationCap className="text-green-600" />
      </div>
      <h3 className="text-xl font-bold">{grade.title}</h3>
      <p className={`text-xs text-center text-gray-600 dark:text-gray-400`}>
        اشتراك الفصل الاول: {grade.firstSemesterPrice}
      </p>
      <p className={`text-xs text-center text-gray-600 dark:text-gray-400`}>
        اشتراك الفصل الثاني: {grade.secondSemesterPrice}
      </p>
    </div>
  );
}
