"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  sendInstruction,
  sendQuizResult,
  sendMultiCourseInstruction,
} from "@/store/conversation/conversationThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { ArrowLeft, Download, X } from "lucide-react";
import { Progress } from "./ui/progress";
import QuizLoader from "./loaders/QuizLoader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "./ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { trackQuizComplete } from "@/utils/gtm";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResult {
  id: number;
  question: string;
  correctAnswer: string;
  options: string[];
  answer: string;
}

interface StepQuizModalProps {
  courseId: number;
  courseIds?: number[]; // للاختبار المتعدد
  title?: string;
}

export default function StepQuizModal({
  courseId,
  courseIds,
  title,
}: StepQuizModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { sendingQuizResult } = useSelector(
    (state: RootState) => state.conversation
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const accountType = useSelector(
    (state: RootState) => state.auth.user?.accountType
  );
  // تحديد ما إذا كان الاختبار متعدد أم لا
  const isMultiCourse = courseIds && courseIds.length > 1;

  const exportPDF = async () => {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    const clone = container.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = "#fff";
    clone.style.color = "#000";
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "0";
    clone.style.width = container.scrollWidth + "px";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    document.body.appendChild(clone);

    // انتظار تحميل الصور
    const images = clone.querySelectorAll("img");
    const imagePromises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(img);
        } else {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        }
      });
    });

    await Promise.all(imagePromises);

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const topMargin = 40;
    const bottomMargin = 40;
    let yOffset = topMargin;

    const titleEl = clone.querySelector("#quiz-title") as HTMLElement;
    if (titleEl) {
      titleEl.style.width = "100%";
      titleEl.style.maxWidth = "500px";
      titleEl.style.padding = "15px";
      titleEl.style.margin = "0 auto";
      titleEl.style.boxSizing = "border-box";
      titleEl.style.display = "flex";
      titleEl.style.color = "#000";
      titleEl.style.flexDirection = "column";
      titleEl.style.alignItems = "center";
      titleEl.style.justifyContent = "center";
      titleEl.style.border = "1px solid #ddd";
      titleEl.style.borderRadius = "8px";

      const logoContainer = titleEl.querySelector("div") as HTMLElement;
      const h2 = titleEl.querySelector("h2") as HTMLElement;
      const divScore = titleEl.querySelector("div:nth-child(2)") as HTMLElement;
      const pMsg = titleEl.querySelector("p") as HTMLElement;

      if (logoContainer) {
        logoContainer.style.display = "flex";
        logoContainer.style.alignItems = "center";
        logoContainer.style.gap = "16px";
        logoContainer.style.marginBottom = "15px";
        logoContainer.style.justifyContent = "center";
      }

      // تحسين عرض اللوغو في PDF
      const logoImg = logoContainer?.querySelector("img") as HTMLImageElement;
      if (logoImg) {
        logoImg.style.width = "50px";
        logoImg.style.height = "50px";
        logoImg.style.borderRadius = "50%";
        logoImg.style.backgroundColor = "#fff";
        logoImg.style.padding = "8px";
        logoImg.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        logoImg.style.objectFit = "contain";
      }

      if (h2) {
        h2.style.fontSize = "20px";
        h2.style.color = "#000";
        h2.style.margin = "0";
        h2.style.fontWeight = "bold";
      }
      if (divScore) {
        divScore.style.fontSize = "24px";
        divScore.style.color = "#007bff";
        divScore.style.margin = "0";
        divScore.style.fontWeight = "bold";
      }
      if (pMsg) {
        pMsg.style.fontSize = "16px";
        pMsg.style.color = "#000";
        pMsg.style.margin = "0";
        pMsg.style.fontWeight = "500";
      }

      const canvasTitle = await html2canvas(titleEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fff",
        logging: true,
        foreignObjectRendering: false,
        width: titleEl.scrollWidth,
        height: titleEl.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedTitleEl = clonedDoc.getElementById("quiz-title");
          if (clonedTitleEl) {
            clonedTitleEl.style.visibility = "visible";
            clonedTitleEl.style.opacity = "1";
            const clonedImg = clonedTitleEl.querySelector("img");
            if (clonedImg) {
              clonedImg.style.display = "block";
              clonedImg.style.visibility = "visible";
            }
          }
        },
      });

      const imgTitle = canvasTitle.toDataURL("image/png");
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (canvasTitle.height * imgWidth) / canvasTitle.width;

      pdf.addImage(imgTitle, "PNG", margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 20;
    }

    const questionsElements = Array.from(
      clone.querySelectorAll(".quiz-question")
    ) as HTMLElement[];

    for (const qEl of questionsElements) {
      const canvas = await html2canvas(qEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fff",
        logging: false,
        foreignObjectRendering: false,
        width: qEl.scrollWidth,
        height: qEl.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight =
        (canvas.height * (pdfWidth - 2 * margin)) / canvas.width;

      if (yOffset + imgHeight + bottomMargin > pdfHeight) {
        pdf.addPage();
        yOffset = topMargin;
      }

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        yOffset,
        pdfWidth - 2 * margin,
        imgHeight
      );
      yOffset += imgHeight + 10;
    }

    document.body.removeChild(clone);
    pdf.save("quiz-result.pdf");
  };

  const openQuiz = async () => {
    setIsOpen(true);
    setLoading(true);

    const instructions: string[] = [
      "Generate a quiz based on the course content provided.",
      "The quiz should contain exactly 10 questions.",
      "Each question should have 4 multiple-choice answers.",
      "Provide the correct answer separately in the response.",
      "Questions should be relevant to the lesson content and in the same language as the lesson.",
      "Do not include any explanations, only questions and answers.",
      "Format the response as a JSON array, where each item is { question: string, options: string[], answer: string }.",
      "Ensure the questions cover all important aspects of the lesson content.",
      "Do not repeat questions.",
      "Return the JSON only, without any extra text.",
    ];

    try {
      const uniqueReference = `quiz-${Date.now()}`;

      let res;
      if (isMultiCourse) {
        // اختبار متعدد للدروس
        res = await dispatch(
          sendMultiCourseInstruction({
            courseId,
            contentType: "Text",
            instractions: instructions,
            courseIds: courseIds!,
            reference: uniqueReference,
            content: "generate quiz questions for these courses.",
          })
        ).unwrap();
      } else {
        // اختبار عادي لدرس واحد
        res = await dispatch(
          sendInstruction({
            reference: uniqueReference,
            courseId,
            content: "generate quiz questions for this course.",
            instractions: instructions,
          })
        ).unwrap();
      }

      let quizData: string;

      if (isMultiCourse) {
        // للاختبار المتعدد، البيانات في res.data مباشرة
        quizData = res.data as unknown as string;
      } else {
        // للاختبار العادي، البيانات في res.data.data
        quizData = res.data.data as unknown as string;
      }

      quizData = quizData.replace(/```json\s*|```/g, "");
      const quizQuestions: Question[] = JSON.parse(quizData);

      setQuestions(quizQuestions);
      setConfirmed(new Array(quizQuestions.length).fill(false));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (confirmed[currentStep]) return;
    const newAnswers = [...answers];
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);
  };

  const nextStep = () => {
    if (!answers[currentStep]) return;

    const newConfirmed = [...confirmed];
    newConfirmed[currentStep] = true;
    setConfirmed(newConfirmed);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateScore();
    }
  };

  const formatQuizResults = (): QuizResult[] => {
    return questions.map((question, index) => ({
      id: index + 1,
      question: question.question,
      correctAnswer: question.answer,
      options: question.options,
      answer: answers[index] || "",
    }));
  };

  const sendQuizResults = async (
    quizResults: QuizResult[],
    finalScore: number
  ) => {
    try {
      // إرسال النتائج كـ JSON string مباشرة كما هو مطلوب
      const resultJsonString = JSON.stringify(quizResults);

      // إضافة تأخير صغير للتأكد من ظهور الطلب في Network
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await dispatch(
        sendQuizResult({
          result: resultJsonString,
          courseId: courseId,
        })
      ).unwrap();

      // إضافة تأخير إضافي للتأكد من ظهور الطلب
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("خطأ في إرسال نتيجة الاختبار:", error);
    }
  };

  const calculateScore = async () => {
    let s = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) s += 10;
    });
    setScore(s);

    // تتبع إكمال الكويز
    trackQuizComplete(courseId, s, questions.length);

    // إرسال نتيجة الاختبار فقط للاختبار العادي وليس المتعدد
    if (!isMultiCourse) {
      const quizResults = formatQuizResults();
      await sendQuizResults(quizResults, s);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setConfirmed(new Array(questions.length).fill(false));
    setScore(null);
  };

  const progressPercent =
    questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  const getRatingMessage = (score: number) => {
    if (score >= 90) return t("courses.excellent");
    if (score >= 70) return t("courses.good");
    if (score >= 50) return t("courses.acceptable");
    return t("courses.poor");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onClick={openQuiz}
            className="w-full mx-auto p-6 bg-blue-600 text-white font-bold text-lg rounded-xl flex flex-col items-center gap-2 hover:bg-blue-700 transition"
          >
            {accountType === "Teacher" ? (
              <>
                {t("courses.developTeaching")}
                <span className="text-yellow-500 font-bold px-1">{title}</span>
                <span className="text-sm flex items-center gap-2 font-normal text-gray-100">
                  <span className="flex flex-col items-center gap-3">
                    {t("courses.trackProgress")}
                  </span>{" "}
                  <span className="">
                    <ArrowLeft />
                  </span>
                </span>
              </>
            ) : (
              <>
                {isMultiCourse
                  ? t("courses.multi_course_test")
                  : t("courses.test_your_knowledge")}{" "}
                {title && `${t("courses.in_lesson")}`}
                <span className="text-yellow-500 font-bold px-1">{title}</span>
                <span className="text-sm flex items-center gap-2 font-normal text-gray-100">
                  <span className="flex flex-col items-center gap-3">
                    {isMultiCourse
                      ? t("courses.ready_for_multi_challenge")
                      : t("courses.ready_for_challenge")}
                  </span>{" "}
                  <span className="">
                    <ArrowLeft />
                  </span>
                </span>
              </>
            )}
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-3xl p-10 bg-white dark:bg-gray-900 mx-auto my-auto max-h-[90vh] overflow-y-auto">
          {loading ? (
            <QuizLoader />
          ) : (
            <div className="w-full pt-10 flex flex-col items-center gap-6">
              {questions.length > 0 && score === null && (
                <Progress
                  value={progressPercent}
                  className="w-full mb-6 h-3 rounded-full"
                />
              )}

              {!loading && score === null && questions[currentStep] && (
                <div className="flex flex-col gap-3 w-full text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {questions[currentStep].question}
                  </h2>

                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {questions[currentStep].options.map((opt, idx) => {
                      const isConfirmed = confirmed[currentStep];
                      const correct = questions[currentStep].answer;
                      let bgClass =
                        "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100";
                      if (isConfirmed) {
                        if (opt === correct)
                          bgClass = "bg-green-500 text-white";
                        else if (answers[currentStep] === opt)
                          bgClass = "bg-red-500 text-white";
                      } else if (answers[currentStep] === opt) {
                        bgClass = "bg-blue-500 text-white";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(opt)}
                          className={`px-4 py-2 rounded border w-full transition ${bgClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end w-full mt-6">
                    <Button
                      onClick={nextStep}
                      disabled={!answers[currentStep]}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {currentStep === questions.length - 1
                        ? t("courses.finish")
                        : t("courses.next_question")}
                    </Button>
                  </div>
                </div>
              )}

              {score !== null && (
                <div className="flex flex-col items-center gap-6 text-center px-4">
                  <div
                    className="flex flex-col items-center gap-6 text-center"
                    id="quiz-container"
                  >
                    <div
                      className="flex flex-col items-center gap-6 text-center"
                      id="quiz-title"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src="/images/logo.png"
                          alt="Smart Teacher"
                          width={60}
                          height={60}
                          className="flex-shrink-0 rounded-full bg-white p-2 shadow-lg"
                          crossOrigin="anonymous"
                        />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {t("courses.final_result")}
                        </h2>
                      </div>
                      <div className="text-2xl md:text-3xl font-extrabold text-blue-600">
                        {score}/100
                      </div>
                      <p className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {getRatingMessage(score)}
                      </p>
                      {sendingQuizResult && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span>جاري حفظ النتيجة...</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full text-right mt-6">
                      <h3 className="text-lg md:text-xl font-bold mb-4">
                        {t("courses.review_answers")}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {questions.map((q, idx) => {
                          const studentAnswer = answers[idx];
                          const correctAnswer = q.answer;
                          const isCorrect = studentAnswer === correctAnswer;

                          return (
                            <div
                              key={idx}
                              className="p-4 border rounded-lg quiz-question"
                            >
                              <h4 className="font-semibold text-base md:text-lg mb-2">
                                {q.question}
                              </h4>
                              <p
                                className={`font-medium ${
                                  isCorrect ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {t("courses.your_answer")}:{" "}
                                {studentAnswer || t("courses.not_answered")}
                              </p>
                              {!isCorrect && (
                                <p className="text-blue-600 font-medium">
                                  {t("courses.correct_answer")}: {correctAnswer}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* الأزرار */}
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <DialogClose asChild>
                      <Button className="w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
                        <X />
                        <span>{t("courses.close_quiz")}</span>
                      </Button>
                    </DialogClose>

                    <Button
                      onClick={resetQuiz}
                      className="w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      {t("courses.retry")}
                    </Button>

                    <Button
                      onClick={exportPDF}
                      className="w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      <Download />
                      <span>{t("courses.download_result_pdf")}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
