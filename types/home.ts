export interface Subject {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  image: string;
  gradeId: number;
  coursesCount: number;
  pdfFile: string;
  courses: Course[];
  semester: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  gradetId: number;
  isFree: boolean;
  image: string;
  courseFile: string;
  bookmarked: boolean;
  enableAI: boolean;
  learningFileExist: boolean;
  createdAt: string;
  updatedAt: string;
  type: string;
  sections?: Section[];
  duration: number;
  courseDuration: number | null;
}
export interface HomeCourse {
  id: number;
  image: string;
  courseFile: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  gradetId: number;
  isFree: boolean;
  description: string;
  subjectId: number;
  bookmarked: boolean;
  enableAI: boolean;
  learningFileExist: boolean;
  courseDuration: number;
  type: string;
  duration: number;
  sections: any[];
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
  course: Course;
}

export interface ClientHomeData {
  subjects: Subject[];
  lastCourses: HomeCourse[];
}

export interface ClientHomeResponse {
  data: ClientHomeData;
  isSuccess: boolean;
  message: string;
  code: number;
}

// Teacher Home Types
export interface TeacherHomeData {
  subjects: Subject[];
  lastCourses: HomeCourse[];
  // يمكن إضافة حقول إضافية خاصة بالمعلم
}

export interface TeacherHomeResponse {
  data: TeacherHomeData;
  isSuccess: boolean;
  message: string;
  code: number;
}

// Parent Home Types
export interface Child {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phoneNumber: string;
  childName: string;
  createdAt: string;
  updatedAt: string;
  birthdate: string;
  isArshived: boolean;
  grades: Grade[];
  subscriptions: Subscription[];
}

export interface Grade {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  firstSemesterPrice: number;
  secondSemesterPrice: number;
  firstSemesterExpireAt: string;
  secondSemesterExpireAt: string;
  subjects: Subject[];
}

export interface Subscription {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  accountId: number;
  expireAt: string;
  account: {
    id: number;
    createdAt: string;
    updatedAt: string;
    birthdate: string;
    grade: any;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    phoneNumber: string;
  };
  grade: Grade;
  plan: {
    id: number;
    title: string;
    type: string;
    price: number;
    expiredAt: string | null;
  } | null;
  semester: string | null;
  cost: number;
  gradeId: number;
  planId: number;
  sessionId: number | null;
}

export interface ParentHomeData {
  children: Child[];
  subscriptions: Subscription[];
}

export interface ParentHomeResponse {
  data: ParentHomeData;
  isSuccess: boolean;
  message: string;
  code: number;
}
