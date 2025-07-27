// src/types/course.ts
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
  title: CourseTitle;
  description: string;
  subjectId: number;
  image: string;
  courseFile: string;
  enableAI: boolean;
  learningFile: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  sections?: Section[];
}

export interface CourseResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: {
    items: Course[];
  };
}

export interface SingleCourseResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: Course;
}
