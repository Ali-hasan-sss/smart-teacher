import { useTranslation } from "@/hooks/useTranslation";
import { Stars } from "lucide-react";
import React from "react";

interface InstructionButton {
  label: React.ReactNode; // نص أو عنصر React
  payload: any;
  disabled?: boolean;
}

export const generateInstructionButtons = (
  courseData: any,
  courseId: number,
  loading: boolean
): InstructionButton[] => {
  const buttons: InstructionButton[] = [];
  const { t } = useTranslation();

  if (courseData.enableAI) {
    buttons.push({
      label: (
        <span className="flex items-center gap-1">
          <Stars className="text-yellow-400" />
          {t("chat.explain")}
        </span>
      ),
      payload: {
        reference: "instruction_explain",
        courseId,
        content: "Generate summary and explanation for the lesson content",
        instractions: [
          "You are an AI tutor that explains the lesson clearly.",
          "Output only the explanation text without any headers or greetings.",
          "Respond in the same language as the lesson content.",
        ],
      },
      disabled: loading,
    });

    buttons.push({
      label: (
        <span className="flex items-center gap-1">
          <Stars className="text-yellow-400" />
          {t("chat.quizzes")}
        </span>
      ),
      payload: {
        reference: "instruction_quiz",
        courseId,
        content:
          "Generate 10 multiple choice quiz questions based on the lesson content",
        instractions: [
          "You are a JSON API that only returns valid JSON.",
          "Output must contain questionId, question, options, correctAnswer.",
          "Respond in the same language as the user question (e.g., if the PDF or lesson is in Arabic, return the questions in Arabic).",
        ],
      },
      disabled: loading,
    });
  }

  return buttons;
};
