// components/loaders/QuizLoader.tsx
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function QuizLoader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  const baseColor = isDark ? "#959191ff" : "#e0e0e0";
  const highlightColor = isDark ? "#f5f5f5ff" : "#f5f5f5";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl flex flex-col items-center gap-6 py-5 px-6">
      {/* شريط التقدم */}
      <Skeleton
        height={12}
        width="100%"
        borderRadius={6}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />

      {/* سؤال */}
      <Skeleton
        height={28}
        width="80%"
        borderRadius={8}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />

      <div className="grid grid-cols-1 gap-4 w-full mt-4">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <Skeleton
              key={idx}
              height={40}
              width="100%"
              borderRadius={8}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          ))}
      </div>
    </div>
  );
}
