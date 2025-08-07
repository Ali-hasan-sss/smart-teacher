export interface Section {
  id: number;
  title: string;
  content: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  course: {
    title: Record<string, string>; // مثال: { additionalProp1: string, ... }
    description: string;
    subjectId: number;
    image: string;
    courseFile: string;
    enableAI: boolean;
    id: number;
    learningFile: string;
    createdAt: string;
    updatedAt: string;
    type: string;
  };
}

export interface Bookmark {
  id: number;
  image: string;
  courseFile: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  subjectId: number;
  bookmarked: boolean;
  enableAI: boolean;
  type: string;
  sections: Section[];
  duration: number;
  courseDuration: number | null;
}

export interface BookmarkResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: {
    items: Bookmark[];
  };
}
