import { useTranslation } from "@/hooks/useTranslation";
import { Download } from "lucide-react";
import React from "react";

interface SubjectCardProps {
  subject: {
    id: number;
    title: string;
    description: string;
    image: string;
    coursesCount: number;
    pdfFile?: string;
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {subject.title}
            </h2>
            {subject.pdfFile && (
              <a
                href={subject.pdfFile}
                download
                className="text-blue-600 cursor-pointer dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title={t("courses.downloadMaterial")}
              >
                <Download size={20} />
              </a>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {shortDescription}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("courses.courseCount")} : ({subject.coursesCount})
          </p>
        </div>
        <button
          onClick={() => onStartStudy(subject.id)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {t("courses.exploer")}
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
