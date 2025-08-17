"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourseById, markActivition } from "@/store/course/courseThunks";
import { useTranslation } from "@/hooks/useTranslation";
import { franc } from "franc";
import LessonPlaceholder from "@/components/loaders/LessonPlaceholder";
import { FileText } from "lucide-react";
import { saveRecentLesson } from "@/utils/recentLessons";
import { markCourseAsViewed } from "@/utils/RecommendedCourses";
import { useCourseActivityTracker } from "@/hooks/useCourseActivity";
import CourseEntray from "@/components/courseIntray";
import Chat from "@/components/chat";

export default function CourseDetailsPage() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.course
  );

  const [dir, setDir] = useState<"rtl" | "ltr">("ltr");
  const [started, setStarted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const openLightbox = (imgs: string[], index: number) => {
    setImages(imgs);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (selectedCourse) {
      saveRecentLesson({
        id: selectedCourse.id.toString(),
        title: selectedCourse.title,
        description: selectedCourse.description,
        image: selectedCourse.image,
        duration: selectedCourse.duration,
      });
      markCourseAsViewed(selectedCourse.id.toString());
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

  useCourseActivityTracker(selectedCourse, started);

  if (loading) return <LessonPlaceholder />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedCourse) return null;

  const descriptionBlocks = JSON.parse(selectedCourse.description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");

  if (!started) {
    return (
      <CourseEntray
        onStart={() => setStarted(true)}
        selectedCourse={selectedCourse}
        dir={dir}
        descriptionText={descriptionText}
        isbookMark={selectedCourse.bookmarked}
      />
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 pt-[150px] `} dir={dir}>
      <div className="flex  items-center justify-between mb-8">
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
        let parsedContent: any = [];
        try {
          parsedContent = JSON.parse(section.content || "[]");
        } catch {}

        return (
          <div key={section.id} className="mb-6">
            {contentType === "Images" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {parsedContent.map((imgUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => openLightbox(parsedContent, index)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* نافذة عرض الصور (Lightbox) */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-1/2 left-4 text-white text-3xl"
            onClick={prevImage}
          >
            ‹
          </button>
          <img
            src={images[currentImageIndex]}
            alt="عرض الصورة"
            className="max-w-full max-h-full rounded shadow-lg"
          />
          <button
            className="absolute top-1/2 right-4 text-white text-3xl"
            onClick={nextImage}
          >
            ›
          </button>
          <button
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
      <Chat courseId={Number(id)} />
    </div>
  );
}
