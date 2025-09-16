import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Search, X } from "lucide-react";
import { Course } from "@/types/course";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

interface SearchBarProps {
  api?: string;
  placeholder?: string;
  className?: string;
  isSubject?: boolean;
  subjectId?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  subjectId,
  api = `api/Client/Course?IncludeBookmark=true${
    subjectId ? `&subjectId=${subjectId}` : ""
  }&title=`,
  placeholder = "Search...",
  isSubject = false,
  className,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;

    setLoading(true);
    try {
      const res = await axios.get(api + query.trim());
      setResult(res.data.data.items);
      setShowDropdown(true);
    } catch (error) {
      console.error(error);
      setResult([]);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const onSelectResult = (result: Course) => {
    if (isSubject) {
      // إذا كان البحث في المواد، احفظ بيانات المادة كاملة واذهب إلى صفحة الدروس
      localStorage.setItem("selectedSubject", JSON.stringify(result));
      router.push("courses");
    } else {
      // إذا كان البحث في الدروس، اذهب مباشرة إلى الدرس
      router.push(`courses/${result.id}`);
    }
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery("");
    setResult([]);
    setShowDropdown(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex py-2 gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full ltr:text-end"
        />

        {loading ? (
          <div className="absolute top-5 w-8 h-8 left-2 text-gray-700 dark:text-white">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="absolute top-3 left-1 flex items-center gap-1">
            {showDropdown && (
              <Button
                type="button"
                onClick={handleClear}
                className="w-8 h-8 rounded-full bg-transparen text-gray-700 dark:text-white hover:text-gray-900"
              >
                <X />
              </Button>
            )}
            <Button
              type="submit"
              className=" h-8 flex items-center justify-center gap-1 rounded-full bg-primary dark:bg-blue-700  dark:hover:bg-transparent text-white dark:text-white hover:text-gray-900"
            >
              <Search className="mr-2" />
              {t("navigation.search")}
            </Button>
          </div>
        )}
      </form>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div
            dir="rtl"
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md max-h-64 overflow-y-auto"
          >
            {result.length > 0 ? (
              result.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelectResult(item)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {item.title}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-300 text-center">
                {t("search.noResults")}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
