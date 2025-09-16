import { Stars } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

interface InstructionButton {
  label: React.ReactNode;
  text: string;
  payload: any;
  disabled?: boolean;
}

export const useInstructionButtons = (
  courseId?: number,
  loading?: boolean
): InstructionButton[] => {
  const [buttons, setButtons] = useState<InstructionButton[]>([]);

  useEffect(() => {
    if (!courseId) {
      setButtons([]);
      return;
    }
    const fetchInstructions = async () => {
      try {
        const res = await axios.post(
          "/api/Client/Conversation/message/instruction",
          {
            reference: new Date().toISOString(),
            courseId,
            content: "Generate instruction buttons for this lesson",
            instractions: [
              "Based on the lesson, generate a list of exactly three new, actionable instructions.",
              'Each item must be a complete sentence, start with an action verb (e.g., "Explain", "Provide"), and be no more than 5 words long.',
              "Provide all instructions in the same language as the lesson.",
              "Do not include apologies or filler text.",
            ],
          }
        );

        let raw: string = res.data?.data?.data ?? "";

        // 🟢 نقسم السطور على \n ونشيل الشرطات
        const instructions = raw
          .split("\n")
          .map((line) => line.replace(/^-/, "").trim())
          .filter((line) => line.length > 0);

        if (Array.isArray(instructions)) {
          const mappedButtons = instructions.map((instruction, index) => ({
            label: (
              <span className="flex items-center gap-1">
                <Stars className="text-yellow-400" />
                {instruction}
              </span>
            ),
            text: instruction,
            payload: {
              reference: `instruction_${index}`,
              courseId,
              content: instruction,
            },
            disabled: loading,
          }));

          setButtons(mappedButtons);
        }
      } catch (err) {
        console.error("Failed to fetch instructions", err);
      }
    };

    fetchInstructions();
  }, [courseId, loading]);

  return buttons;
};
