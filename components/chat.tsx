"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Message } from "@/types/conversation";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Mic,
  Send,
  MessageCircle,
  ArrowBigRight,
  ArrowDown,
  X,
} from "lucide-react";
import {
  fetchMessagesByCourse,
  fetchGeneralMessages,
  sendMessage,
  sendGeneralMessage,
} from "@/store/conversation/conversationThunks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import TeachingRobot from "./robot/teachingRobot";
import Image from "next/image";
import axios from "@/lib/axios";

interface ChatProps {
  courseId?: number;
}

export default function Chat({ courseId }: ChatProps) {
  const dispatch = useAppDispatch();
  const { messages, loading } = useSelector(
    (state: RootState) => state.conversation
  );

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState<"TEXT" | "AUDIO">("TEXT");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    if (!text.trim()) return;

    const payload = {
      courseId: courseId ?? 0,
      contentType,
      content: text,
    };

    if (courseId) {
      dispatch(sendMessage(payload));
    } else {
      dispatch(sendGeneralMessage(payload));
    }

    setText("");
  };

  const isoading = messages.some(
    (m: Message) => m.messageType === "Answer" && !m.content
  );
  const handleAudio = async () => {
    if (!isRecording) {
      // بدء التسجيل
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

        // إيقاف كل المسارات لمنع بقاء المايك مشغول
        stream.getTracks().forEach((track) => track.stop());

        try {
          const res = await axios.post(
            "/api/Common/BaseFile/UploadAnyFile",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          const payload = {
            courseId: courseId ?? 0,
            contentType: "AUDIO",
            content: res.data.filePath,
          };

          if (courseId) {
            dispatch(sendMessage(payload));
          } else {
            dispatch(sendGeneralMessage(payload));
          }
        } catch (error) {
          console.error("Failed to upload audio:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } else {
      // إيقاف التسجيل
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
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
              <Card className="w-full md:w-1/2 flex flex-col dark:bg-primary bg-white rounded-t-2xl md:rounded-none shadow-2xl">
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
                      {courseId ? "محادثة الكورس" : "محادثة عامة"}
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
                        return (
                          <div key={m.id} className="relative flex w-full">
                            {!isUser && (
                              <div className="flex-shrink-0 mr-2">
                                <Image
                                  src="/images/robot.png"
                                  alt="chat"
                                  width={30}
                                  height={30}
                                  className="rounded-full"
                                />
                              </div>
                            )}

                            <div
                              className={`p-2 my-2 rounded-xl max-w-xl ${
                                isUser
                                  ? "ml-auto bg-blue-600 text-white rounded-br-none"
                                  : "mr-auto bg-gray-200 dark:bg-gray-800 rounded-tl-none"
                              }`}
                            >
                              {m.messageType === "Answer" && !m.content ? (
                                <div className="flex items-center space-x-1">
                                  <span className="dot dot1" />
                                  <span className="dot dot2" />
                                  <span className="dot dot3" />
                                </div>
                              ) : (
                                m.content
                              )}
                            </div>
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

                {/* شريط الإدخال */}
                <div className="flex items-center gap-2 p-3 border-t dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      contentType === "TEXT"
                        ? setContentType("AUDIO")
                        : handleAudio()
                    }
                  >
                    {contentType === "TEXT" ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <Mic
                        className={`w-5 h-5 ${
                          isRecording ? "animate-pulse text-red-500" : ""
                        }`}
                      />
                    )}
                  </Button>

                  <Input
                    placeholder={"اكتب رسالتك..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend} className="bg-blue-600">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>

              <div className="hidden md:flex w-1/2 items-center justify-center bg-white/30 dark:bg-primary/30 backdrop-blur-md">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1.5} />
                  <Environment preset="sunset" />
                  <TeachingRobot loading={isoading} />
                </Canvas>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
