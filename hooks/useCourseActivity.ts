import { useEffect, useRef } from "react";
import { markActivition } from "@/store/course/courseThunks";
import { Course } from "@/types/course";
import { useAppDispatch } from "@/store/hooks";

export const useCourseActivityTracker = (selectedCourse: Course | null) => {
  const dispatch = useAppDispatch();
  const startTimeRef = useRef<number>(Date.now());
  const durationRef = useRef<number>(0);

  useEffect(() => {
    if (!selectedCourse?.id) return;

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

    const saveInterval = setInterval(() => {
      const now = Date.now();
      const duration =
        Math.floor((now - startTimeRef.current) / 1000) + durationRef.current;
      localStorage.setItem(localStorageKey, duration.toString());
    }, 10000);

    const sendInterval = setInterval(() => {
      const now = Date.now();
      const duration =
        Math.floor((now - startTimeRef.current) / 1000) + durationRef.current;

      if (duration > 0) {
        dispatch(markActivition({ courseId: selectedCourse.id, duration }));
        localStorage.removeItem(localStorageKey);
        startTimeRef.current = Date.now();
        durationRef.current = 0;
      }
    }, 3 * 60 * 1000);

    const handleUnload = () => {
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
      clearInterval(saveInterval);
      clearInterval(sendInterval);
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [selectedCourse?.id]);
};
