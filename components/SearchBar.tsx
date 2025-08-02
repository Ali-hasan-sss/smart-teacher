import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Search, X } from "lucide-react";
import { Course } from "@/types/course";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  api?: string;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  api = "api/Client/Course?IncludeBookmark=true&title=",
  placeholder = "Search...",
  buttonLabel = "Search",
  className,
}) => {
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
      setShowDropdown(true); // حتى لو فشل نعرض رسالة فارغة
    } finally {
      setLoading(false);
    }
  };

  const onSelectResult = (id: string) => {
    router.push(`courses/${id}`);
    setShowDropdown(false); // إغلاق القائمة بعد التنقل
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
          <div className="absolute top-5 w-8 h-8 left-2 text-white dark:text-white">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        ) : showDropdown ? (
          <Button
            type="button"
            onClick={handleClear}
            className="absolute top-3 w-8 h-8 left-2 text-white dark:text-white hover:text-gray-900"
          >
            <X />
          </Button>
        ) : (
          <Button
            type="submit"
            className="absolute top-3 h-8 left-2 text-white dark:text-white hover:text-gray-900"
          >
            <Search className="mr-2" />
            {buttonLabel}
          </Button>
        )}
      </form>

      {showDropdown && (
        <div
          dir="rtl"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md max-h-64 overflow-y-auto"
        >
          {result.length > 0 ? (
            result.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onSelectResult(result.id.toString())}
              >
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {result.title}
                </span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500 dark:text-gray-300 text-center">
              لا توجد نتائج مطابقة
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
