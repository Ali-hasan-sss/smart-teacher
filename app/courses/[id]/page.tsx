"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourseById, markActivition } from "@/store/course/courseThunks";
import { useTranslation } from "@/hooks/useTranslation";
import { franc } from "franc";
import LessonPlaceholder from "@/components/loaders/LessonPlaceholder";
import { FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useCourseActivityTracker } from "@/hooks/useCourseActivity";
import CourseEntray from "@/components/courseIntray";
import Chat from "@/components/chat";
import StepQuizModal from "@/components/quizModal";
import { isSubscribedToGrade } from "@/utils/getActiveSubscription";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PlansModal from "@/components/planModal";
import { AnimatePresence, motion } from "framer-motion";
import { trackCourseView, trackCourseStart, trackPageView } from "@/utils/gtm";

export default function CourseDetailsPage() {
  const { t, language } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();

  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.course
  );

  const [dir, setDir] = useState<"rtl" | "ltr">("ltr");
  const [started, setStarted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectData, setSubjectData] = useState<any | null>(null);
  const subscriptions = useSelector(
    (state: RootState) => state.subscription.items
  );
  const subscriptionsLoading = useSelector(
    (state: RootState) => state.subscription.loading
  );

  const gradeId = Number(selectedCourse?.gradetId || 0);
  const activeSub = isSubscribedToGrade(subscriptions, gradeId);
  const isSubscribed = !!activeSub;
  const isFree = selectedCourse?.isFree || false;

  console.log("Course details:", {
    id: selectedCourse?.id,
    isFree,
    isSubscribed,
    gradeId,
    title: selectedCourse?.title,
  });

  const openLightbox = (imgs: string[], index: number) => {
    setImages(imgs);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // دالة التنقل الذكي
  const handleBackNavigation = () => {
    if (started) {
      // إذا كان في محتوى الدرس، ارجع إلى مدخل الدرس
      setStarted(false);
    } else {
      // إذا كان في مدخل الدرس، ارجع إلى دروس المادة
      if (subjectData) {
        // تحديد نوع الدرس للعودة إلى القسم المناسب
        if (selectedCourse?.type === "Quiz") {
          // إذا كان الدرس اختبار، ارجع إلى قسم الاختبارات
          router.push("/courses?view=quizzes");
        } else {
          // إذا كان الدرس عادي، ارجع إلى قسم الدروس
          router.push("/courses?view=lessons");
        }
      } else {
        // إذا لم تكن هناك بيانات مادة، استخدم الرجوع العادي
        router.back();
      }
    }
  };
  useEffect(() => {
    if (started) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [started]);

  useEffect(() => {
    if (selectedCourse && !isFree && !isSubscribed) {
      setModalVisible(true);
    }
  }, [selectedCourse, isFree, isSubscribed]);

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

  // جلب بيانات المادة من localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedSubject");
      if (stored) {
        setSubjectData(JSON.parse(stored));
      }
    }
  }, []);

  // Track page view when course is loaded
  useEffect(() => {
    if (selectedCourse) {
      trackPageView(`/courses/${id}`, selectedCourse.title);
      trackCourseView(
        selectedCourse.id,
        selectedCourse.title,
        selectedCourse.isFree
      );
    }
  }, [selectedCourse, id]);

  useCourseActivityTracker(selectedCourse, started);

  if (subscriptionsLoading) return <LessonPlaceholder />;
  if (!isFree && !isSubscribed && selectedCourse)
    return (
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
          <PlansModal
            courseId={Number(id)}
            gradeId={Number(selectedCourse?.gradetId)}
            onClose={() => setModalVisible(false)}
          />
        </DialogContent>
      </Dialog>
    );
  if (loading) return <LessonPlaceholder />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedCourse) return null;

  const descriptionBlocks = JSON.parse(selectedCourse.description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");

  if (!started) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* زر الرجوع */}
          <div className="fixed top-4 rtl:right-4 ltr:left-4 z-50">
            <button
              onClick={handleBackNavigation}
              className="mb-4 px-4 flex fixed top-5 z-50 items-center gap-2 py-2 rounded bg-gray-200 dark:bg-gray-700"
            >
              {language === "ar" ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  {t("navigation.back")}
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  {t("navigation.back")}
                </>
              )}
            </button>
          </div>

          <CourseEntray
            onStart={() => {
              setStarted(true);
              trackCourseStart(selectedCourse.id, selectedCourse.title);
            }}
            selectedCourse={selectedCourse}
            dir={dir}
            descriptionText={selectedCourse.description || "[]"}
            isbookMark={selectedCourse.bookmarked}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 pt-[150px] `} dir={dir}>
      {/* زر الرجوع */}
      <div className="fixed top-4 rtl:right-4 ltr:right-4 z-50">
        <button
          onClick={handleBackNavigation}
          className="mb-4 px-4 flex fixed top-5 z-50 items-center gap-2 py-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          {language === "ar" ? (
            <>
              <ArrowRight className="w-4 h-4" />
              {t("navigation.back")}
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              {t("navigation.back")}
            </>
          )}
        </button>
      </div>

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
          alt={t("courses.course_image")}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <p className="text-lg whitespace-pre-wrap mb-8">
        {descriptionText || t("courses.no_description")}
      </p>
      {selectedCourse.type === "Quiz" && selectedCourse.courseFile && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">{t("courses.pdf_preview")}</h2>
          <iframe
            src={selectedCourse.courseFile}
            className="w-full h-[600px] rounded border"
            title="PDF Preview"
          ></iframe>
        </div>
      )}
      {selectedCourse.sections?.map((section: any) => {
        const contentType = section.type;
        let parsedContent: any = section.content;

        try {
          parsedContent = JSON.parse(section.content);
        } catch {
          // إذا ما كان JSON (زي الفيديو), نخليها سترنغ عادي
        }

        return (
          <div key={section.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {section.title || parsedContent?.title || contentType}
            </h2>

            {/* PDF Section */}
            {contentType === "Pdf" && parsedContent?.pdf && (
              <div className="mt-4">
                <a
                  href={parsedContent.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                >
                  {/* الصورة المصغرة */}
                  {parsedContent.cover && (
                    <img
                      src={parsedContent.cover}
                      alt={t("courses.file_cover")}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  {/* عنوان الملف */}
                  <span className="flex-1 text-left">
                    {parsedContent.title || t("courses.open_file")}
                  </span>
                  {/* أيقونة السهم باتجاه اليسار */}
                  <span className="text-xl">⬅️</span>
                </a>
              </div>
            )}

            {/* Video Section */}
            {contentType === "Video" && typeof parsedContent === "string" && (
              <div className="mt-4 w-full relative">
                {/* Loader */}
                {!videoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
                      <span className="text-white text-sm">
                        {t("courses.loading")}
                      </span>
                    </div>
                  </div>
                )}

                <video
                  src={parsedContent}
                  controls
                  className="w-full h-[400px]  object-cover rounded shadow"
                  onLoadedData={() => setVideoLoaded(true)}
                />
              </div>
            )}

            {/* Images Section */}
            {contentType === "Images" && Array.isArray(parsedContent) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {parsedContent.map((imgUrl: string, index: number) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${t("courses.image")} ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition"
                    onClick={() => openLightbox(parsedContent, index)}
                  />
                ))}
              </div>
            )}

            {/* Text Section */}
            {contentType === "Text" && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mt-4">
                <p className="whitespace-pre-wrap">{parsedContent}</p>
              </div>
            )}
          </div>
        );
      })}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-1/2 left-4 text-white text-3xl hover:bg-white hover:bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center transition-all"
            onClick={prevImage}
            title={t("courses.previous")}
          >
            ‹
          </button>
          <img
            src={images[currentImageIndex]}
            alt={`${t("courses.image")} ${currentImageIndex + 1}`}
            className="max-w-full max-h-full rounded shadow-lg"
          />
          <button
            className="absolute top-1/2 right-4 text-white text-3xl hover:bg-white hover:bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center transition-all"
            onClick={nextImage}
            title={t("courses.next")}
          >
            ›
          </button>
          <button
            className="absolute top-6 right-6 text-white text-2xl hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            onClick={() => setLightboxOpen(false)}
            title={t("courses.close")}
          >
            ✕
          </button>
        </div>
      )}
      {selectedCourse.learningFileExist && (
        <Chat courseId={Number(id)} courseData={selectedCourse} />
      )}
      {selectedCourse.learningFileExist && (
        <StepQuizModal courseId={selectedCourse.id} />
      )}
    </div>
  );
}
