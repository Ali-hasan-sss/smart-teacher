import { Course } from "@/types/course";
import StepQuizModal from "./quizModal";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { CheckSquare, Square } from "lucide-react";

interface quizcontainerproop {
  courses: Course[];
}

export default function QuizContainer({ courses }: quizcontainerproop) {
  const { t } = useTranslation();
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showSelectionMode, setShowSelectionMode] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const quizButtonRef = useRef<HTMLDivElement>(null);
  const originalPositionRef = useRef<number>(0);

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    setSelectedCourses(courses.map((course) => course.id));
  };

  const clearSelection = () => {
    setSelectedCourses([]);
  };

  const toggleSelectionMode = () => {
    setShowSelectionMode(!showSelectionMode);
    if (showSelectionMode) {
      // إعادة تعيين التحديد عند إغلاق وضع التحديد
      setSelectedCourses([]);
    }
  };

  const isAllSelected = selectedCourses.length === courses.length;
  const hasSelection = selectedCourses.length > 0;

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (
        !quizButtonRef.current ||
        !showSelectionMode ||
        selectedCourses.length <= 1 ||
        originalPositionRef.current === 0
      ) {
        return;
      }

      const scrollY = window.scrollY;

      // Check if we should make it sticky (scrolled past original position)
      if (scrollY > originalPositionRef.current - 16) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Don't set position here, it's handled in separate useEffect

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSelectionMode, selectedCourses.length]);

  // Reset sticky state when selection changes but keep position
  useEffect(() => {
    // Only reset sticky state, don't touch originalPositionRef
    setIsSticky(false);
  }, [selectedCourses.length, showSelectionMode]);

  // Reset position only when closing selection mode
  useEffect(() => {
    if (!showSelectionMode) {
      originalPositionRef.current = 0;
    }
  }, [showSelectionMode]);

  // Set original position after component renders
  useEffect(() => {
    if (
      quizButtonRef.current &&
      showSelectionMode &&
      selectedCourses.length > 1
    ) {
      // Set immediately
      originalPositionRef.current = quizButtonRef.current.offsetTop;

      // Also set after a short delay to ensure it's correct
      const timer = setTimeout(() => {
        if (quizButtonRef.current) {
          originalPositionRef.current = quizButtonRef.current.offsetTop;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showSelectionMode, selectedCourses.length]);

  return (
    <div className="space-y-6">
      {/* Header with selection controls */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("courses.quizzes")}
          </h2>

          {!showSelectionMode ? (
            <Button
              onClick={toggleSelectionMode}
              className="bg-blue-600  hover:bg-blue-700 text-white"
            >
              {t("courses.multi_course_test")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={toggleSelectionMode}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                {t("navigation.cancel")}
              </Button>
            </div>
          )}
        </div>

        {showSelectionMode && (
          <>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <Button
                onClick={selectAllCourses}
                variant="outline"
                size="sm"
                disabled={isAllSelected}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 mr-2" />
                ) : (
                  <Square className="w-4 h-4 mr-2" />
                )}
                {t("courses.select_all")}
              </Button>

              <Button
                onClick={clearSelection}
                variant="outline"
                size="sm"
                disabled={!hasSelection}
              >
                {t("courses.clear_selection")}
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCourses.length > 0
                ? `${selectedCourses.length} ${t("courses.lessons_selected")}`
                : t("courses.select_lessons_for_multi_quiz")}
            </p>
          </>
        )}
      </div>

      {/* Multi-course quiz container */}
      {showSelectionMode && selectedCourses.length > 1 && (
        <div
          ref={quizButtonRef}
          className={`${
            isSticky ? "fixed top-4 left-4 right-4 z-50" : ""
          } mb-6`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <StepQuizModal
              courseId={selectedCourses[0]}
              courseIds={selectedCourses}
              title={t("courses.multi_course_test")}
            />
          </div>
        </div>
      )}

      {/* Individual course quizzes */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
          showSelectionMode && selectedCourses.length > 1 && isSticky
            ? "pt-32"
            : ""
        }`}
      >
        {courses.map((course: Course) => (
          <AnimatePresence key={course.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <div
                className={`p-4 border rounded-lg shadow transition-all ${
                  showSelectionMode && selectedCourses.includes(course.id)
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Course selection checkbox - يظهر فقط في وضع التحديد */}
                {showSelectionMode && (
                  <div className="flex items-center mb-3">
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => toggleCourseSelection(course.id)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("courses.select_for_multi_quiz")}
                    </span>
                  </div>
                )}

                {/* Individual quiz button */}
                <StepQuizModal courseId={course.id} title={course.title} />
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}
