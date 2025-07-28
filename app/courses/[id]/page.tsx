"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/course/courseThunks";
import { useTranslation } from "@/hooks/useTranslation";
import { franc } from "franc";

export default function CourseDetailsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { selectedCourse, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const [dir, setDir] = useState<"rtl" | "ltr">("ltr");

  useEffect(() => {
    const text = selectedCourse?.title || "";
    const lang = franc(text || "", { minLength: 5 });

    if (lang === "arb") {
      setDir("rtl");
    } else {
      setDir("ltr");
    }
  }, [selectedCourse]);
  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(Number(id)));
    }
  }, [dispatch, id]);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedCourse) return null;

  const descriptionBlocks = JSON.parse(selectedCourse.description || "[]");
  const descriptionText = descriptionBlocks
    .map((block: any) => block.insert)
    .join("");

  return (
    <div className={`max-w-4xl mx-auto p-6`} dir={dir}>
      <h1 className="text-3xl font-bold mb-4">
        {selectedCourse.title || "عنوان غير متوفر"}
      </h1>

      {selectedCourse.image && (
        <img
          src={selectedCourse.image}
          alt="صورة الكورس"
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}

      <p className="text-lg whitespace-pre-wrap mb-8">
        {descriptionText || "لا يوجد وصف"}
      </p>

      {selectedCourse.sections?.map((section: any) => (
        <div key={section.id} className="mb-6">
          {section.type === "Text" && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
              {JSON.parse(section.content || "[]").map(
                (block: any, index: number) => (
                  <p key={index} className="mb-2 whitespace-pre-wrap">
                    {block.insert}
                  </p>
                )
              )}
            </div>
          )}
          {section.type === "Images" &&
            JSON.parse(section.content || "[]").map(
              (imgUrl: string, index: number) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`صورة القسم ${index + 1}`}
                  className="w-full rounded shadow mb-4"
                />
              )
            )}
        </div>
      ))}
    </div>
  );
}
