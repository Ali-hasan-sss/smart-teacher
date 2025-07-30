"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchBookmarks,
  removeBookmark,
} from "@/store/bookmark/bookmarkThunks";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import LoaderPage from "@/components/loaders/LoaderPage";
import { useTranslation } from "@/hooks/useTranslation";

export default function BookmarkList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { bookmarks, loading, error, toggleLoading } = useSelector(
    (state: RootState) => state.bookmark
  );

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch, language]);

  const handleRemove = (courseId: number) => {
    dispatch(removeBookmark(courseId.toString()));
  };

  if (loading) return <LoaderPage />;
  if (error) return <p className="text-red-600">{error}</p>;

  if (!bookmarks.length)
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <p>{t("courses.No_bookMarks")}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-[100px]">
      <h2 className="text-2xl font-bold mb-6">{t("courses.bookMarks")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <CourseCard
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            image={bookmark.image}
            isBookmarked={true}
            onToggleBookmark={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
