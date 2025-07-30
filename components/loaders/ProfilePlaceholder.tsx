import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProfilePlaceholder() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
  }, []);

  const baseColor = isDark ? "#444" : "#e0e0e0";
  const highlightColor = isDark ? "#666" : "#f5f5f5";

  return (
    <div className="relative pt-[100px] max-w-lg mx-auto mt-8 p-0 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center py-10 px-6">
        {/* صورة الملف الشخصي */}
        <div className="relative mb-4">
          <Skeleton
            circle
            height={128}
            width={128}
            baseColor={baseColor}
            highlightColor={highlightColor}
            style={{
              border: "4px solid #60a5fa",
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {/* الاسم */}
        <Skeleton
          height={28}
          width="60%"
          baseColor={baseColor}
          highlightColor={highlightColor}
          className="mb-6"
        />

        {/* معلومات المستخدم */}
        <div className="flex flex-col gap-3 mt-6 text-base w-full max-w-xs mx-auto mb-6">
          {[1, 2, 3, 4].map((_, i) => (
            <Skeleton
              key={i}
              height={20}
              width="100%"
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          ))}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
          {[1, 2, 3].map((_, i) => (
            <Skeleton
              key={i}
              height={42}
              width="100%"
              baseColor={baseColor}
              highlightColor={highlightColor}
              className="sm:w-auto"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
