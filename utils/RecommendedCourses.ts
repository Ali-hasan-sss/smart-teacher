import { Course } from "@/types/course";

// عند فتح كورس معين:
export function markCourseAsViewed(courseId: string) {
  const viewed = JSON.parse(localStorage.getItem("viewedCourses") || "[]");
  if (!viewed.includes(courseId)) {
    viewed.push(courseId);
    localStorage.setItem("viewedCourses", JSON.stringify(viewed));
  }
}

// لإظهار الكورسات الموصى بها:
export function getRecommendedCourses(allCourses: Course[]): Course[] {
  const viewed = JSON.parse(localStorage.getItem("viewedCourses") || "[]");
  return allCourses
    .filter((c) => !viewed.includes(c.id)) // لم تُعرض من قبل
    .slice(0, 5); // خذ أول 5 كورسات كمثال
}
