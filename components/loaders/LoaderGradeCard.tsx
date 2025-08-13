// components/loaders/LoaderGradeCard.tsx
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoaderGradeCard() {
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
    <div className="w-[200px] flex flex-col items-center gap-3 bg-white dark:bg-primary p-5 rounded-lg">
      {/* الأيقونة */}
      <Skeleton
        circle
        height={60}
        width={60}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />

      {/* اسم الصف */}
      <Skeleton
        height={24}
        width={140}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />

      {/* سعر الفصل الأول */}
      <Skeleton
        height={14}
        width={160}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />

      {/* سعر الفصل الثاني */}
      <Skeleton
        height={14}
        width={160}
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
    </div>
  );
}
