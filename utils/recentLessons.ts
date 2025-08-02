// utils/recentLessons.ts
export const saveRecentLesson = (course: {
  id: string;
  title: string;
  image: string;
  description: string;
  duration: number;
}) => {
  const existing = JSON.parse(localStorage.getItem("recentLessons") || "[]");

  // إزالة أي درس مكرر
  const filtered = existing.filter((l: any) => l.id !== course.id);

  // إضافة الدرس الجديد في الأعلى
  const updated = [course, ...filtered];

  // تحديد عدد الدروس المخزنة (مثلاً 5)
  localStorage.setItem("recentLessons", JSON.stringify(updated.slice(0, 5)));
};
export const getRecentLessons = () => {
  return JSON.parse(localStorage.getItem("recentLessons") || "[]");
};
