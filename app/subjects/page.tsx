"use client";

import SubjectCard from "@/components/SubjectCard";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchSubjects } from "@/store/subject/subjectThunk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function SubjectsList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, totalPages, loading, error } = useSelector(
    (state: RootState) => state.subjects
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const gradeId = user?.grade?.id;
  const { t } = useTranslation();

  useEffect(() => {
    if (gradeId) {
      dispatch(fetchSubjects({ gradeId }));
    }
  }, [gradeId, dispatch]);

  const startStudy = (subjectId: number) => {
    localStorage.setItem("selectedSubject", String(subjectId));
    router.push("/courses");
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t("subjects.title")}
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={{
                id: subject.id,
                title: subject.title,
                description: subject.description,
                coursesCount: subject.courseCount,
                image: subject.image,
              }}
              onStartStudy={() => startStudy(subject.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
