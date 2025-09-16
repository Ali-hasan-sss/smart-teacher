// Google Tag Manager utility functions

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize dataLayer if it doesn't exist
export const initDataLayer = () => {
  if (typeof window !== "undefined" && !window.dataLayer) {
    window.dataLayer = [];
  }
};

// Push events to dataLayer
export const gtmPush = (data: any) => {
  if (typeof window !== "undefined") {
    initDataLayer();
    window.dataLayer.push(data);
  }
};

// Track page views
export const trackPageView = (pagePath: string, pageTitle: string) => {
  gtmPush({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// Track course interactions
export const trackCourseView = (
  courseId: number,
  courseTitle: string,
  isFree: boolean
) => {
  gtmPush({
    event: "course_view",
    course_id: courseId,
    course_title: courseTitle,
    is_free: isFree,
  });
};

// Track course start
export const trackCourseStart = (courseId: number, courseTitle: string) => {
  gtmPush({
    event: "course_start",
    course_id: courseId,
    course_title: courseTitle,
  });
};

// Track quiz completion
export const trackQuizComplete = (
  courseId: number,
  score: number,
  totalQuestions: number
) => {
  gtmPush({
    event: "quiz_complete",
    course_id: courseId,
    score: score,
    total_questions: totalQuestions,
    percentage: Math.round((score / totalQuestions) * 100),
  });
};

// Track subscription events
export const trackSubscription = (
  planId: number,
  planName: string,
  price: number
) => {
  gtmPush({
    event: "subscription",
    plan_id: planId,
    plan_name: planName,
    price: price,
    currency: "OMR",
  });
};

// Track chat interactions
export const trackChatMessage = (
  courseId: number,
  messageType: "question" | "answer"
) => {
  gtmPush({
    event: "chat_message",
    course_id: courseId,
    message_type: messageType,
  });
};

// Track PDF downloads
export const trackPDFDownload = (courseId: number, fileName: string) => {
  gtmPush({
    event: "pdf_download",
    course_id: courseId,
    file_name: fileName,
  });
};
