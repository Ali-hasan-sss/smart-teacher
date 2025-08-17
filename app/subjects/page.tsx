"use client";

import SearchCTA from "@/components/Cta/searchCTA";
import LoaderPage from "@/components/loaders/LoaderPage";
import PaginationComponent from "@/components/pagination";
import SearchBar from "@/components/forms/SearchBar";
import SubjectCard from "@/components/cards/SubjectCard";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchSubjects } from "@/store/subject/subjectThunk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chat from "@/components/chat";

export default function SubjectsList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, totalPages, loading, error } = useSelector(
    (state: RootState) => state.subjects
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const gradeId = user?.grade?.id;
  const { t, language } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (gradeId) {
      dispatch(fetchSubjects({ gradeId }));
    }
  }, [gradeId, dispatch, language]);

  const startStudy = (subjectId: number) => {
    localStorage.setItem("selectedSubject", String(subjectId));
    router.push("/courses");
  };

  if (loading) return <LoaderPage />;
  if (error) return <div> {error}</div>;

  return (
    <div className="min-h-screen pt-[100px] py-12 px-4 sm:px-6 lg:px-8">
      <Chat />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3 py-5 md:justify-between mb-8  items-center">
          <h1 className="text-3xl w-full md:w-1/3 font-bold  text-gray-900 dark:text-white ">
            {t("subjects.title")}
          </h1>
          <div className="flex items-center justify-center w-full md:w-1/2 px-2 md:px-5">
            <SearchBar api="/api/Client/Subject?&title=" isSubject />
          </div>
        </div>
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
                coursesCount: subject.coursesCount,
                image: subject.image,
                pdfFile: subject.pdfFile,
              }}
              onStartStudy={() => startStudy(subject.id)}
            />
          ))}
        </div>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            dispatch(fetchSubjects({ gradeId, pageNumber: page }));
          }}
        />
      </div>
    </div>
  );
}
