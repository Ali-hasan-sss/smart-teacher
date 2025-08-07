import { useEffect, useRef } from "react";
import { markActivition } from "@/store/course/courseThunks";
import { Course } from "@/types/course";
import { useAppDispatch } from "@/store/hooks";

export const useCourseActivityTracker = (
  selectedCourse: Course | null,
  started: boolean
) => {
  const dispatch = useAppDispatch();
  const startTimeRef = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedCourse?.id || !started) return;

    // عند أول مرة يبدأ فيها المستخدم
    startTimeRef.current = Date.now();
    const localStorageKey = `course-activity-${selectedCourse.id}`;

    const savedDuration = parseInt(
      localStorage.getItem(localStorageKey) || "0"
    );

    if (savedDuration > 0) {
      dispatch(
        markActivition({ courseId: selectedCourse.id, duration: savedDuration })
      );
      localStorage.removeItem(localStorageKey);
    }

    saveIntervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      const now = Date.now();
      const duration =
        Math.floor((now - startTimeRef.current) / 1000) + durationRef.current;
      localStorage.setItem(localStorageKey, duration.toString());
    }, 10000); // كل 10 ثواني

    sendIntervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      const now = Date.now();
      const duration =
        Math.floor((now - startTimeRef.current) / 1000) + durationRef.current;

      if (duration > 0) {
        dispatch(markActivition({ courseId: selectedCourse.id, duration }));
        localStorage.removeItem(localStorageKey);
        startTimeRef.current = Date.now();
        durationRef.current = 0;
      }
    }, 3 * 60 * 1000); // كل 3 دقائق

    const handleUnload = () => {
      if (startTimeRef.current === null) return;
      const now = Date.now();
      const duration =
        Math.floor((now - startTimeRef.current) / 1000) + durationRef.current;

      if (duration > 0) {
        dispatch(markActivition({ courseId: selectedCourse.id, duration }));
        localStorage.removeItem(localStorageKey);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [selectedCourse?.id, started]);
};
