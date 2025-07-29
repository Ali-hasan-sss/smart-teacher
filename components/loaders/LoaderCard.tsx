// components/loaders/LoaderCard.tsx
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoaderCard() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow space-y-4">
      {/* صورة أو فيديو الدرس */}
      <Skeleton
        height={200}
        borderRadius={10}
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* عنوان الدرس */}
      <Skeleton
        height={24}
        width="70%"
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* وصف مختصر */}
      <Skeleton
        height={18}
        width="90%"
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />
      <Skeleton
        height={18}
        width="60%"
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />

      {/* زر أو رابط */}
      <Skeleton
        height={40}
        width="100%"
        borderRadius={8}
        baseColor={isDark ? "#959191ff" : "#e0e0e0"}
        highlightColor={isDark ? "#f5f5f5ff" : "#f5f5f5"}
      />
    </div>
  );
}
