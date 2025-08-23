"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Message } from "@/types/conversation";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Mic, Send, X } from "lucide-react";
import {
  fetchMessagesByCourse,
  fetchGeneralMessages,
  sendMessage,
  sendGeneralMessage,
  sendInstruction,
} from "@/store/conversation/conversationThunks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import axios from "@/lib/axios";
import RobotScene from "./robot/RobotScene";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { generateInstructionButtons } from "@/components/ai.buttomGenerate";
import {
  addMessage,
  updateMessage,
} from "@/store/conversation/conversationSlice";
import { useTranslation } from "@/hooks/useTranslation";

interface ChatProps {
  courseId?: number;
  courseData?: any;
}

export default function Chat({ courseId, courseData }: ChatProps) {
  const dispatch = useAppDispatch();
  const { messages, loading, sendingMessage, sendingInstruction } = useSelector(
    (state: RootState) => state.conversation
  );
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [contentType, setContentType] = useState<"TEXT" | "AUDIO">("TEXT");
  const [isRecording, setIsRecording] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const user = useSelector((state: RootState) => state.account.user);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (courseId) {
        dispatch(fetchMessagesByCourse(courseId));
      } else {
        dispatch(fetchGeneralMessages(0));
      }
    }
  }, [open, courseId, dispatch]);

  const handleSend = () => {
    if (!text.trim() && contentType === "TEXT") return;

    const payload = {
      courseId: courseId ?? 0,
      contentType,
      content: text,
    };

    if (courseId) dispatch(sendMessage(payload));
    else dispatch(sendGeneralMessage(payload));

    setText("");
    setContentType("TEXT");
  };

  const handleAudio = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("file", audioBlob, `audio_${Date.now()}.webm`);
        stream.getTracks().forEach((track) => track.stop());

        try {
          setIsUploading(true);
          const res = await axios.post(
            "/api/Common/BaseFile/UploadAnyFile",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          const payload = {
            courseId: courseId ?? 0,
            contentType: "AUDIO",
            content: res.data.data.url,
          };

          if (courseId) dispatch(sendMessage(payload));
          else dispatch(sendGeneralMessage(payload));
        } catch (error) {
          console.error("Failed to upload audio:", error);
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleSendInstruction = async (payload: any) => {
    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      messageType: "Answer",
      contentType: "Text",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: messages.length + 1,
      audioFile: null,
    };
    dispatch(addMessage(tempMessage));

    try {
      const res: any = await dispatch(sendInstruction(payload)).unwrap();
      const text = typeof res.data?.data === "string" ? res.data.data : "";

      dispatch(updateMessage({ id: tempId, content: text }));
    } catch (error) {
      dispatch(
        updateMessage({
          id: tempId,
          content: "فشل في إرسال الرسالة. حاول مرة أخرى.",
        })
      );
    }
  };

  return (
    <>
      {/* الزر العائم */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6  rounded-full w-20 h-20 shadow-lg z-20 bg-transparent "
      >
        <Image
          src={"/images/chat.png"}
          alt="chat"
          width={60}
          height={60}
          className="absolute"
        />
        <Image
          src={"/images/robot.png"}
          alt="chat"
          width={30}
          height={30}
          className="absolute top-4 right-6"
        />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            dir="ltr"
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 w-full h-[100vh] z-40"
          >
            <div className="flex w-full h-full">
              {/* النصف الأول: المحادثة */}
              <Card className="w-full md:w-1/2 flex flex-col bg-secondary dark:bg-primary  rounded-t-2xl md:rounded-none shadow-2xl">
                {/* الهيدر */}
                <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(!open)}
                      title="close"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <h3 className="font-semibold">
                      {courseId ? t("chat.course") : t("chat.general")}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="download conversation"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>

                {/* صندوق الرسائل */}
                <ScrollArea className="flex-1 p-3 space-y-2">
                  {messages.length > 0 ? (
                    <>
                      {messages.map((m: Message) => {
                        const isUser = m.messageType === "Question";
                        const isAudio =
                          m.audioFile ||
                          m.contentType?.toUpperCase() === "AUDIO";

                        // ===== تحقق إذا كانت الرسالة تعليمية بصيغة JSON للاختبارات =====
                        let parsedTest: any[] | null = null;
                        if (m.messageType === "Answer" && m.content) {
                          try {
                            // إزالة ```json و ``` إذا وجدت
                            const clean = m.content
                              .replace(/```json|```/g, "")
                              .trim();
                            parsedTest = JSON.parse(clean);
                          } catch (err) {
                            parsedTest = null; // ليس JSON صحيح
                          }
                        }

                        return (
                          <div
                            key={m.id}
                            className={`flex w-full my-2 ${
                              isUser ? "justify-end" : "justify-start"
                            } items-start`}
                          >
                            {!isUser && (
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage
                                  src={"/images/robot.png"}
                                  alt="Bot"
                                />
                                <AvatarFallback>{"B"}</AvatarFallback>
                              </Avatar>
                            )}

                            {/* صندوق الرسالة */}
                            <div
                              className={`p-2 rounded-xl max-w-xl ${
                                isUser
                                  ? "bg-blue-600 text-white rounded-tr-none"
                                  : "bg-blue-400 dark:bg-gray-800 rounded-tl-none"
                              }`}
                            >
                              {m.messageType === "Answer" && !m.content ? (
                                <div className="flex items-center space-x-1">
                                  <span className="dot dot1" />
                                  <span className="dot dot2" />
                                  <span className="dot dot3" />
                                </div>
                              ) : isAudio ? (
                                <div className="flex flex-col space-y-2">
                                  <audio
                                    controls
                                    src={m.audioFile ?? m.content ?? undefined}
                                    className="max-w-xs"
                                  />
                                  {m.content && (
                                    <>
                                      <button
                                        onClick={() =>
                                          setExpanded((prev) => ({
                                            ...prev,
                                            [m.id]: !prev[m.id],
                                          }))
                                        }
                                        className="text-sm text-blue-600 underline self-start"
                                      >
                                        {expanded[m.id]
                                          ? "إخفاء النص"
                                          : "عرض النص"}
                                      </button>
                                      {expanded[m.id] && (
                                        <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                          {m.content}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              ) : parsedTest ? (
                                // ===== عرض الاختبار بشكل تفاعلي =====
                                <div className="flex flex-col gap-4">
                                  {parsedTest.map((q) => (
                                    <div
                                      key={q.questionId}
                                      className="p-2 border rounded-md bg-gray-100 dark:bg-gray-700"
                                    >
                                      <p className="font-semibold">
                                        {q.question}
                                      </p>
                                      <div className="flex flex-col mt-1 gap-1">
                                        {q.options.map(
                                          (opt: string, idx: number) => (
                                            <button
                                              key={idx}
                                              className="text-left p-1 rounded hover:bg-blue-400 dark:hover:bg-blue-600"
                                            >
                                              {opt}
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                // عرض النص العادي
                                <p className="whitespace-pre-wrap">
                                  {m.content}
                                </p>
                              )}
                            </div>

                            {isUser && user && (
                              <Avatar className="w-8 h-8 ml-2">
                                <AvatarImage
                                  src={user.image}
                                  alt={user.firstName}
                                />
                                <AvatarFallback>
                                  {user.firstName?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </>
                  ) : (
                    <p className="text-center text-gray-500">
                      لا توجد رسائل بعد
                    </p>
                  )}
                </ScrollArea>

                {/* أزرار التعليمات */}
                {courseId && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {generateInstructionButtons(
                      courseData,
                      courseId,
                      sendingInstruction || sendingMessage
                    ).map((btn) => (
                      <Button
                        key={btn.payload.reference}
                        size="sm"
                        variant="outline"
                        disabled={btn.disabled}
                        onClick={() => handleSendInstruction(btn.payload)}
                      >
                        {btn.label}
                      </Button>
                    ))}
                  </div>
                )}

                {/* شريط الإدخال */}
                <div className="flex items-center gap-2 p-3 border-t dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={() =>
                      contentType === "TEXT"
                        ? setContentType("AUDIO")
                        : handleAudio()
                    }
                  >
                    {contentType === "TEXT" ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <div className="relative">
                        <Mic
                          className={`w-5 h-5 ${
                            isRecording ? "animate-pulse text-red-500" : ""
                          }`}
                        />
                        {isUploading && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        )}
                      </div>
                    )}
                  </Button>

                  <Input
                    placeholder={"اكتب رسالتك..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-blue-600 hover:text-black dark:hover:text-white"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>

              <div className="hidden md:flex w-1/2 items-center justify-center bg-white/30 dark:bg-primary/30 backdrop-blur-md">
                <RobotScene className="w-full h-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
