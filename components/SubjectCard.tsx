import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

interface SubjectCardProps {
  subject: {
    id: number;
    title: string;
    description: string;
    image: string;
    coursesCount: number;
  };
  onStartStudy: (subjectId: number) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onStartStudy }) => {
  const { t } = useTranslation();
  const shortDescription =
    subject.description.split(" ").slice(0, 5).join(" ") + " ...";

  return (
    <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden flex flex-col">
      <img
        src={subject.image}
        alt={subject.title}
        className="h-48 object-cover w-full"
      />
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            {subject.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {shortDescription}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("courses.courseCount")} : {subject.coursesCount}
          </p>
        </div>
        <button
          onClick={() => onStartStudy(subject.id)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {t("courses.startLearning")}
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
