// src/types/course.ts
export interface FetchCoursesParams {
  pageNumber: number;
  pageSize: number;
  subjectId?: number;
}

export interface CourseTitle {
  en?: string;
  ar?: string;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  courseId: number;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  image: string;
  courseFile: string;
  bookmarked: boolean;
  enableAI: boolean;
  learningFile: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  sections?: Section[];
  duration: number;
}

export interface CourseResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: {
    items: Course[];
    totalPages: number;
  };
}
export interface CourseListData {
  items: Course[];
  totalPages: number;
}

export interface SingleCourseResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: Course;
}
