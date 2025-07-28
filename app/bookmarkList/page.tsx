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

export default function BookmarkList() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { bookmarks, loading, error } = useSelector(
    (state: RootState) => state.bookmark
  );

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const handleRemove = (courseId: number) => {
    dispatch(removeBookmark(courseId.toString()));
  };

  if (loading) return <p>جاري تحميل المحفوظات...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (!bookmarks.length) return <p>لا يوجد دروس محفوظة حاليا.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">الدروس المحفوظة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <CourseCard
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            image={bookmark.image}
            isBookmarked={true} // بما أنه في صفحة المحفوظات
            onToggleBookmark={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
