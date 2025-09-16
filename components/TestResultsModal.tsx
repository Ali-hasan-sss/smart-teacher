"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle, Clock, Award } from "lucide-react";

interface TestResult {
  id: number;
  question: string;
  correctAnswer: string;
  options: string[];
  answer: string;
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testResults: TestResult[];
  subjectTitle: string;
  courseTitle: string;
  totalScore: number;
  maxScore: number;
  testDate: string;
}

export default function TestResultsModal({
  isOpen,
  onClose,
  testResults,
  subjectTitle,
  courseTitle,
  totalScore,
  maxScore,
  testDate,
}: TestResultsModalProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  const percentage = Math.round((totalScore / maxScore) * 100);
  const isPassed = percentage >= 60;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                نتائج الاختبار
              </DialogTitle>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">المادة:</span> {subjectTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">الدرس:</span> {courseTitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">تاريخ الاختبار:</span>{" "}
                  {testDate}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  {isPassed ? (
                    <Award className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalScore} / {maxScore}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    ({percentage}%)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={isPassed ? "default" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {isPassed ? "نجح" : "راسب"}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {isPassed
                    ? "مبروك! لقد نجحت في الاختبار"
                    : "يجب إعادة الاختبار"}
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Answers Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAnswers(!showAnswers)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showAnswers ? (
                <>
                  <X className="h-4 w-4" />
                  إخفاء الإجابات
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  عرض الإجابات التفصيلية
                </>
              )}
            </Button>
          </div>

          {/* Test Questions and Answers */}
          {showAnswers && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                الأسئلة والإجابات
              </h4>
              {testResults && testResults.length > 0 ? (
                testResults.map((result, index) => {
                  const isCorrect = result.answer === result.correctAnswer;
                  return (
                    <div
                      key={result.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              سؤال {index + 1}
                            </span>
                            <Badge
                              variant={isCorrect ? "default" : "destructive"}
                              className="text-xs text-white"
                            >
                              {isCorrect ? "صحيح" : "خطأ"}
                            </Badge>
                          </div>

                          <p className="text-gray-900 dark:text-white mb-4 font-medium">
                            {result.question}
                          </p>

                          <div className="space-y-2">
                            {result.options && Array.isArray(result.options) ? (
                              result.options.map((option, optionIndex) => {
                                let optionClass =
                                  "p-3 rounded-lg border text-sm ";

                                if (option === result.correctAnswer) {
                                  optionClass +=
                                    "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300";
                                } else if (
                                  option === result.answer &&
                                  !isCorrect
                                ) {
                                  optionClass +=
                                    "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300";
                                } else {
                                  optionClass +=
                                    "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300";
                                }

                                return (
                                  <div
                                    key={optionIndex}
                                    className={optionClass}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {String.fromCharCode(65 + optionIndex)}.
                                      </span>
                                      <span>{option}</span>
                                      {option === result.correctAnswer && (
                                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                                      )}
                                      {option === result.answer &&
                                        !isCorrect && (
                                          <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                        )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                                لا توجد خيارات متاحة
                              </div>
                            )}
                          </div>

                          {!isCorrect && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <span className="font-medium">
                                  الإجابة الصحيحة:
                                </span>{" "}
                                {result.correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  لا توجد نتائج اختبار متاحة
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
