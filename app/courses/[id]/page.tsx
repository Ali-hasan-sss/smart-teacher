"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/course/courseThunks";
import { useTranslation } from "@/hooks/useTranslation";
import { franc } from "franc";
import LessonPlaceholder from "@/components/loaders/LessonPlaceholder";
import { Download, FileText } from "lucide-react";
import { saveRecentLesson } from "@/utils/recentLessons";

export default function CourseDetailsPage() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const [dir, setDir] = useState<"rtl" | "ltr">("ltr");

  useEffect(() => {
    if (selectedCourse) {
      saveRecentLesson({
        id: selectedCourse.id.toString(),
        title: selectedCourse.title,
        description: selectedCourse.description,
        image: selectedCourse.image,
      });
    }
  }, [selectedCourse]);

  useEffect(() => {
    const text = selectedCourse?.title || "";
    const lang = franc(text || "", { minLength: 5 });

    if (lang === "arb") {
      setDir("rtl");
    } else {
      setDir("ltr");
    }
  }, [selectedCourse]);
  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(Number(id)));
    }
  }, [dispatch, id, language]);

  if (loading) return <LessonPlaceholder />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedCourse) return null;

  const descriptionBlocks = JSON.parse(selectedCourse.description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");

  return (
    <div className={`max-w-4xl mx-auto p-6 pt-[100px] `} dir={dir}>
      <div className="flex  items-center justify-between mb-4">
        <h1 className="text-3xl font-bold ">{selectedCourse.title}</h1>
        {selectedCourse.courseFile && (
          <a
            href={selectedCourse.courseFile}
            download
            className="text-white rounded-full bg-blue-500 flex items-center justify-center w-10 h-10 font-bold cursor-pointer hover:text-blue-800 dark:hover:text-blue-300"
            title={t("courses.downloadMaterial")}
          >
            <FileText size={20} />
          </a>
        )}
      </div>

      {selectedCourse.image && (
        <img
          src={selectedCourse.image}
          alt="صورة الكورس"
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <p className="text-lg whitespace-pre-wrap mb-8">
        {descriptionText || "لا يوجد وصف"}
      </p>
      {selectedCourse.type === "Quiz" && selectedCourse.courseFile && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">
            {t("courses.viewPdf") || "معاينة الملف"}
          </h2>
          <iframe
            src={selectedCourse.courseFile}
            className="w-full h-[600px] rounded border"
            title="PDF Preview"
          ></iframe>
        </div>
      )}

      {selectedCourse.sections?.map((section: any) => {
        const contentType = section.type;
        const parsedContent = (() => {
          try {
            return JSON.parse(section.content || "[]");
          } catch {
            return [];
          }
        })();

        return (
          <div key={section.id} className="mb-6">
            {/* نصوص Quill */}
            {contentType === "Text" && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
                {parsedContent.map((block: any, index: number) => (
                  <p key={index} className="mb-2 whitespace-pre-wrap">
                    {block.insert}
                  </p>
                ))}
              </div>
            )}

            {/* صور */}
            {contentType === "Images" &&
              parsedContent.map((imgUrl: string, index: number) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`صورة القسم ${index + 1}`}
                  className="w-full rounded shadow mb-4"
                />
              ))}

            {/* فيديو */}
            {contentType === "Video" && typeof section.content === "string" && (
              <div className="aspect-video w-full rounded overflow-hidden shadow">
                <video controls className="w-full h-full">
                  <source src={section.content} type="video/mp4" />
                  {t("courses.videoNotSupported") ||
                    "متصفحك لا يدعم تشغيل الفيديو"}
                </video>
              </div>
            )}

            {/* PDF */}
            {contentType === "PDF" &&
              (() => {
                let pdfContent: {
                  pdf: string;
                  title?: string;
                  cover?: string;
                } = {
                  pdf: "",
                };
                try {
                  pdfContent = JSON.parse(section.content || "{}");
                } catch {}
                return (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow flex flex-col md:flex-row items-center gap-4">
                    {pdfContent.cover && (
                      <img
                        src={pdfContent.cover}
                        alt="غلاف الملف"
                        className="w-32 h-40 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold dark:text-white mb-2">
                        {pdfContent.title || t("courses.pdfTitle") || "ملف PDF"}
                      </h3>
                      <a
                        href={pdfContent.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        {t("courses.viewPdf") || "عرض الملف"}
                      </a>
                    </div>
                  </div>
                );
              })()}
          </div>
        );
      })}
    </div>
  );
}
