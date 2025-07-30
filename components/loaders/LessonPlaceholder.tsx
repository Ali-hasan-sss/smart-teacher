// components/LessonPlaceholder.tsx
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LessonPlaceholder() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  return (
    <div className="p-10 pt-[100px]  px-4 lg:px-20 space-y-6">
      {/* عنوان الدرس */}
      <Skeleton
        height={32}
        width="20%"
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* صورة رئيسية للدرس */}
      <Skeleton
        height={200}
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* فقرات نصية */}
      <div className="space-y-4">
        <Skeleton
          count={3}
          baseColor={isDark ? "#959191ff" : "#e0e0e0"}
          highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
        />
        <Skeleton
          width="80%"
          baseColor={isDark ? "#959191ff" : "#e0e0e0"}
          highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
        />
        <Skeleton
          count={2}
          baseColor={isDark ? "#959191ff" : "#e0e0e0"}
          highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
        />
      </div>

      {/* صورة إضافية */}
      <Skeleton
        height={150}
        width="100%"
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* فقرة إضافية */}
      <Skeleton
        count={4}
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />
    </div>
  );
}
