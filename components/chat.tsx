"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import type { Message } from "@/types/conversation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckSquare,
  Download,
  Mic,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import {
  fetchMessagesByCourse,
  fetchGeneralMessages,
  sendMessage,
  sendGeneralMessage,
  deleteConversation,
  deleteMessages,
} from "@/store/conversation/conversationThunks";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import axios from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import { OrbitControls } from "@react-three/drei";
import RobotModel from "./robot/RobotModel";
import { thinkingAnimation } from "./robot/thinkingAnimation";
import { Canvas } from "@react-three/fiber";
import { useInstructionButtons } from "@/hooks/ai.buttomGenerate";
import { useTeacherInstructionButtons } from "@/hooks/ai.teacherButtons";
import { hasAnyActiveSubscription } from "@/utils/getActiveSubscription";
import ConfirmDialog from "./ConfirmDialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ChatProps {
  courseId?: number;
  className?: string;
  courseData?: any;
}

export default function Chat({ courseId, className, courseData }: ChatProps) {
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
  const subscriptions = useSelector(
    (state: RootState) => state.subscription.items || []
  );
  const accountType = useSelector(
    (state: RootState) => state.auth.user?.accountType
  );
  // استخدام الـ hook المناسب حسب نوع الحساب
  const studentButtons = useInstructionButtons(
    courseId ?? undefined,
    sendingInstruction || sendingMessage
  );

  const teacherButtons = useTeacherInstructionButtons(
    courseId ?? undefined,
    sendingInstruction || sendingMessage
  );

  // تحديد الأزرار المناسبة حسب نوع الحساب
  const buttons = accountType === "Teacher" ? teacherButtons : studentButtons;
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [ConfirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );

  const anyActive = hasAnyActiveSubscription(subscriptions);

  // تحديد ما إذا كان يجب عرض زر الشات
  const shouldShowChat = () => {
    // إذا كان المستخدم معلم، اعرض الشات دائماً
    if (accountType === "Teacher") {
      return true;
    }

    // إذا كان المستخدم مشترك، اعرض الشات
    if (anyActive) {
      return true;
    }

    // إذا كان الدرس مجاني، اعرض الشات حتى لو لم يكن مشترك
    if (courseId && courseData?.isFree) {
      return true;
    }

    return false;
  };

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

  const handleSendButton = (text: string) => {
    const payload = {
      courseId: courseId ?? 0,
      contentType: "TEXT",
      content: text,
    };

    if (courseId) dispatch(sendMessage(payload));
    else dispatch(sendGeneralMessage(payload));
  };

  const streamRef = useRef<MediaStream | null>(null);
  const cancelRecordingRef = useRef<() => void>();

  const handleAudio = async () => {
    if (typeof window === "undefined") return;
    try {
      if (!isRecording) {
        if (!streamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          streamRef.current = stream;
        }

        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        let isCancelled = false;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }

          if (isCancelled) return;

          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("file", audioBlob, `audio_${Date.now()}.webm`);

          try {
            setIsUploading(true);
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
              content: res.data.data.url,
            };

            if (courseId) dispatch(sendMessage(payload));
            else dispatch(sendGeneralMessage(payload));
          } catch (err) {
            console.error("Failed to upload audio:", err);
          } finally {
            setIsUploading(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        cancelRecordingRef.current = () => {
          isCancelled = true;
          mediaRecorder.stop();
          audioChunksRef.current = [];
          setIsRecording(false);
        };
      } else {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("تعذر الوصول إلى الميكروفون. يرجى التأكد من سماح المتصفح.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMessages.length > 0) {
      await dispatch(deleteMessages(selectedMessages));
      setSelectedMessages([]);
      setSelectMode(false);
    }
  };

  const handleDeleteConversation = async () => {
    await dispatch(deleteConversation(courseId ?? 0));
    setSelectedMessages([]);
    setSelectMode(false);
  };

  const toggleSelectMessage = (id: number) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDownloadConversation = async () => {
    try {
      // إنشاء PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // إنشاء العنوان كصورة
      const createHeaderImage = async () => {
        const headerElement = document.createElement("div");
        headerElement.style.position = "absolute";
        headerElement.style.left = "-9999px";
        headerElement.style.top = "0";
        headerElement.style.width = `${pageWidth - margin * 2}mm`;
        headerElement.style.backgroundColor = "#ffffff";
        headerElement.style.padding = "20px";
        headerElement.style.borderRadius = "10px";
        headerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        headerElement.style.fontFamily = "Arial, sans-serif";
        headerElement.style.direction = "rtl";
        headerElement.style.textAlign = "center";

        const title = courseId
          ? t("chat.course_conversation")
          : t("chat.general_conversation");
        const date = new Date().toLocaleDateString("en-US");

        headerElement.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div style="width: 50px; height: 50px; background-color:rgb(249, 250, 253); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);">
              <img src="/images/logo.png" alt="المعلم الذكي" style="width: 35px; height: 35px; object-fit: contain;" />
            </div>
            <h1 style="color: #3b82f6; font-size: 24px; margin: 0; font-weight: bold;">${title}</h1>
            <p style="color: #666; font-size: 14px; margin: 0;">${t(
              "chat.export_date"
            )}: ${date}</p>
          </div>
        `;

        document.body.appendChild(headerElement);
        const headerCanvas = await html2canvas(headerElement, {
          backgroundColor: "#ffffff",
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          width: headerElement.scrollWidth,
          height: headerElement.scrollHeight,
          logging: true,
          foreignObjectRendering: false,
        });
        document.body.removeChild(headerElement);
        return headerCanvas;
      };

      // إنشاء التذييل كصورة
      const createFooterImage = async () => {
        const footerElement = document.createElement("div");
        footerElement.style.position = "absolute";
        footerElement.style.left = "-9999px";
        footerElement.style.top = "0";
        footerElement.style.width = `${pageWidth - margin * 2}mm`;
        footerElement.style.backgroundColor = "#f8f9fa";
        footerElement.style.padding = "10px";
        footerElement.style.borderRadius = "5px";
        footerElement.style.fontFamily = "Arial, sans-serif";
        footerElement.style.direction = "rtl";
        footerElement.style.textAlign = "center";

        footerElement.innerHTML = `
          <div style="color: #666; font-size: 12px;">
            © 2025 ${t("navigation.home")} - ${t("chat.smart_assistant")}
          </div>
        `;

        document.body.appendChild(footerElement);
        const footerCanvas = await html2canvas(footerElement, {
          backgroundColor: "#f8f9fa",
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          width: footerElement.scrollWidth,
          height: footerElement.scrollHeight,
          logging: true,
          foreignObjectRendering: false,
        });
        document.body.removeChild(footerElement);
        return footerCanvas;
      };

      // إنشاء الصور
      const headerCanvas = await createHeaderImage();
      const footerCanvas = await createFooterImage();

      // إضافة العنوان
      const headerWidth = pageWidth - margin * 2;
      const headerHeight =
        (headerCanvas.height * headerWidth) / headerCanvas.width;
      pdf.addImage(
        headerCanvas,
        "PNG",
        margin,
        margin,
        headerWidth,
        headerHeight
      );

      // تصدير الرسائل
      let currentY = margin + headerHeight + 15;
      let pageNumber = 0;
      const maxHeight = pageHeight - margin - 30; // مساحة للتذييل
      const messageSpacing = 8; // مسافة بين الرسائل

      console.log(`Starting to export ${messages.length} messages`);

      if (messages.length === 0) {
        alert(t("chat.no_messages_to_export"));
        return;
      }

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        console.log(`Processing message ${i + 1}/${messages.length}`);

        // إنشاء عنصر مؤقت للرسالة
        const messageElement = document.createElement("div");
        messageElement.style.position = "absolute";
        messageElement.style.left = "-9999px";
        messageElement.style.top = "0";
        messageElement.style.width = "350px";
        messageElement.style.backgroundColor = "#ffffff";
        messageElement.style.padding = "6px 6px 12px 6px"; // بادينغ سفلي إضافي
        messageElement.style.borderRadius = "8px";
        messageElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
        messageElement.style.fontFamily = "Arial, sans-serif";
        messageElement.style.fontSize = "13px"; // زيادة حجم الخط
        messageElement.style.lineHeight = "1.4"; // تحسين المسافة بين الأسطر
        messageElement.style.direction = "rtl";
        messageElement.style.textAlign = "right";
        messageElement.style.fontWeight = "500"; // تحسين وضوح الخط

        // إضافة محتوى الرسالة
        const isUser = message.messageType === "Question";
        const messageContent = message.content || "";

        // التحقق من وجود محتوى
        if (!messageContent.trim()) {
          console.log(`Message ${i + 1} has no content, skipping`);
          continue;
        }

        // تنظيف المحتوى من LaTeX
        const cleanContent = messageContent
          .replace(/\\\[/g, "")
          .replace(/\\\]/g, "")
          .replace(/\\times/g, "×")
          .replace(/\\[\d]/g, "")
          .trim();

        messageElement.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 6px; ${
            isUser ? "flex-direction: row-reverse;" : "flex-direction: row;"
          }">
            <div style="width: 24px; height: 24px; border-radius: 50%; background-color: ${
              isUser ? "#3b82f6" : "#1e40af"
            }; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">
              ${isUser ? user?.firstName || "U" : "Smart teacher"}
            </div>
            <div style="flex: 1; background-color: ${
              isUser ? "#3b82f6" : "#1e40af"
            }; color: white; padding: 8px 8px 12px 8px; border-radius: 8px; ${
          isUser ? "border-top-right-radius: 0;" : "border-top-left-radius: 0;"
        }">
              <div style="white-space: pre-wrap; word-wrap: break-word; font-size: 12px; line-height: 1.3; font-weight: 500; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased;">${cleanContent}</div>
            </div>
          </div>
        `;

        // إضافة العنصر إلى الصفحة
        document.body.appendChild(messageElement);

        // تحويل الرسالة إلى صورة
        const messageCanvas = await html2canvas(messageElement, {
          backgroundColor: "#ffffff",
          scale: 1.5, // تقليل الحجم لضمان العمل
          useCORS: true,
          allowTaint: true,
          width: 350,
          height: messageElement.scrollHeight,
          logging: true, // تفعيل السجلات للتشخيص
          foreignObjectRendering: false, // تعطيل هذا الخيار
        });

        // إزالة العنصر المؤقت
        document.body.removeChild(messageElement);

        // التحقق من وجود محتوى في canvas
        if (messageCanvas.height === 0 || messageCanvas.width === 0) {
          console.error(`Message ${i + 1} canvas is empty`);
          continue;
        }

        console.log(
          `Message ${i + 1} canvas: ${messageCanvas.width}x${
            messageCanvas.height
          }`
        );

        // حساب أبعاد الصورة
        const imgWidth = pageWidth - margin * 2;
        const imgHeight =
          (messageCanvas.height * imgWidth) / messageCanvas.width;

        // التحقق من الحاجة لصفحة جديدة
        if (currentY + imgHeight > maxHeight) {
          // إضافة صفحة جديدة
          pdf.addPage();
          pageNumber++;
          currentY = margin;
        }

        // إضافة صورة الرسالة
        try {
          pdf.addImage(
            messageCanvas,
            "PNG",
            margin,
            currentY,
            imgWidth,
            imgHeight
          );
          console.log(`Message ${i + 1} added successfully`);
        } catch (error) {
          console.error(`Error adding message ${i + 1}:`, error);
        }

        // تحديث الموضع للرسالة التالية
        currentY += imgHeight + messageSpacing;
      }

      // إضافة التذييل للصفحة الأخيرة
      const footerWidth = pageWidth - margin * 2;
      const footerHeight =
        (footerCanvas.height * footerWidth) / footerCanvas.width;
      pdf.addImage(
        footerCanvas,
        "PNG",
        margin,
        pageHeight - footerHeight - margin,
        footerWidth,
        footerHeight
      );

      const filename = courseId
        ? `${t("chat.course_conversation")}_${courseId}_${Date.now()}.pdf`
        : `${t("chat.general_conversation")}_${Date.now()}.pdf`;

      pdf.save(filename);
      console.log(`PDF exported successfully with ${pageNumber + 1} pages`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(t("chat.export_error"));
    }
  };

  return (
    <>
      {shouldShowChat() && (
        <Button
          onClick={() => setOpen(!open)}
          className={`fixed px-4 h-16 border-[2px] border-yellow-700 
    flex items-center justify-center gap-2 shadow-lg z-20 
    bg-primary/95 backdrop-blur-3xl hover:bg-secondary 
    text-white hover:text-gray-800 dark:text-gray-300 rounded-2xl ${className}
    ${
      courseId ? "w-1/2 bottom-6 left-1/2 -translate-x-1/2" : "bottom-6 right-6"
    }
  `}
        >
          <Image
            src={"/images/whitelogo.png"}
            alt="chat"
            width={30}
            height={30}
          />
          <span className="hidden sm:inline">
            {accountType === "Teacher"
              ? courseId
                ? t("chat.teaching_strategy")
                : t("chat.teaching_strategy_general")
              : courseId
              ? t("chat.ask_smart")
              : t("chat.chat_smart")}
          </span>
        </Button>
      )}
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
              <Card className="w-full md:w-1/2 flex flex-col bg-secondary dark:bg-primary  rounded-t-2xl md:rounded-none shadow-2xl">
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
                    title={t("chat.download_conversation")}
                    onClick={handleDownloadConversation}
                    disabled={messages.length === 0}
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  <div className="flex gap-2">
                    {selectMode ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setConfirmAction(() => handleDeleteSelected);
                            setConfirmOpen(true);
                          }}
                          title={t("chat.delete_selected")}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectMode(false)}
                          title={t("chat.cancel_selection")}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectMode(true)}
                          title={t("chat.select_messages")}
                        >
                          <CheckSquare className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setConfirmAction(() => handleDeleteConversation);
                            setConfirmOpen(true);
                          }}
                          title={t("chat.clear_conversation")}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <ScrollArea
                  className="flex-1 p-3 space-y-2"
                  id="chat-container"
                >
                  {messages.length > 0 ? (
                    <>
                      {messages.map((m: Message) => {
                        const isUser = m.messageType === "Question";
                        const isAudio =
                          m.audioFile ||
                          m.contentType?.toUpperCase() === "AUDIO";
                        const selected = selectedMessages.includes(m.id);

                        return (
                          <div
                            key={m.id}
                            className={`flex w-full my-2 ${
                              isUser ? "justify-end" : "justify-start"
                            } items-start`}
                          >
                            {selectMode && (
                              <button
                                onClick={() => toggleSelectMessage(m.id)}
                                className="p-1"
                              >
                                {selected ? (
                                  <CheckSquare className="text-blue-600" />
                                ) : (
                                  <Square />
                                )}
                              </button>
                            )}

                            {!isUser && (
                              <div className="w-10 h-10 mr-2 rounded-full bg-gray-300 dark:bg-third flex-shrink-0">
                                <img
                                  src="/images/logo.png"
                                  alt="Bot"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}

                            <div
                              className={`p-2 rounded-xl max-w-xl ${
                                isUser
                                  ? "bg-blue-600 text-white rounded-tr-none"
                                  : "bg-blue-400 dark:bg-gray-800 rounded-tl-none"
                              }`}
                            >
                              {m.messageType === "Answer" &&
                              !m.content &&
                              !m.audioFile ? (
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
                                          ? t("chat.hide_text")
                                          : t("chat.view_text")}
                                      </button>
                                      {expanded[m.id] && (
                                        <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                          {m.content}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className="prose prose-sm max-w-none leading-relaxed p-3 rounded-lg text-gray-900 dark:text-gray-100"
                                  dir={
                                    m.content &&
                                    /[\u0600-\u06FF]/.test(m.content)
                                      ? "rtl"
                                      : "ltr"
                                  }
                                  style={{
                                    textAlign:
                                      m.content &&
                                      /[\u0600-\u06FF]/.test(m.content)
                                        ? "right"
                                        : "left",
                                  }}
                                >
                                  {m.content ? (
                                    <div className="whitespace-pre-wrap">
                                      {m.content
                                        .replace(/\\\[/g, "")
                                        .replace(/\\\]/g, "")
                                        .split("\n")
                                        .map((line, lineIndex) => {
                                          if (line.includes("\\times")) {
                                            return (
                                              <div
                                                key={lineIndex}
                                                className="my-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm"
                                              >
                                                {line
                                                  .replace(/\\times/g, "×")
                                                  .replace(/\\[\d]/g, "")
                                                  .trim()}
                                              </div>
                                            );
                                          }

                                          if (line.trim() === "") {
                                            return (
                                              <div
                                                key={lineIndex}
                                                className="h-2"
                                              />
                                            );
                                          }

                                          return (
                                            <div
                                              key={lineIndex}
                                              className="mb-1"
                                            >
                                              {line.trim()}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  ) : (
                                    "❌ فشل في إرسال الرسالة"
                                  )}
                                </div>
                              )}
                            </div>

                            {isUser && user && (
                              <Avatar className="w-8 h-8 ml-2">
                                <AvatarImage
                                  src={user.image || "/placeholder.svg"}
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
                      {t("chat.no_message")}
                    </p>
                  )}
                </ScrollArea>

                {courseId && buttons.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    {buttons.map((btn) => (
                      <Button
                        key={btn.payload.reference}
                        size="sm"
                        variant="outline"
                        disabled={btn.disabled}
                        onClick={() => handleSendButton(btn.text)}
                      >
                        {btn.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 border-t dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={() => {
                      if (contentType === "TEXT") {
                        setContentType("AUDIO");
                      } else if (isRecording) {
                        mediaRecorderRef.current?.stop();
                        setIsRecording(false);
                      } else {
                        handleAudio();
                      }
                    }}
                  >
                    {contentType === "TEXT" ? (
                      <Mic className="w-5 h-5" />
                    ) : isRecording ? (
                      <Send className="w-5 h-5 text-green-500 animate-pulse" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                  {isRecording && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => cancelRecordingRef.current?.()}
                      title={t("chat.cancel_recording")}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}

                  <Input
                    placeholder={t("chat.whrite_message")}
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
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 5, 5]} intensity={2.0} />
                  <directionalLight position={[-5, 5, 5]} intensity={1.2} />
                  <directionalLight position={[0, 10, 0]} intensity={1.0} />
                  <pointLight
                    position={[0, 3, 3]}
                    intensity={1.0}
                    color="#ffffff"
                  />
                  <pointLight
                    position={[3, 0, 3]}
                    intensity={0.8}
                    color="#ffffff"
                  />
                  <RobotModel animation={thinkingAnimation} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                  />
                </Canvas>
              </div>
            </div>
          </motion.div>
        )}
        <ConfirmDialog
          open={ConfirmOpen}
          setOpen={setConfirmOpen}
          title={t("chat.confirm_delete")}
          message={t("chat.confirm_delete_message")}
          confirmText={t("navigation.yes")}
          cancelText={t("navigation.cancel")}
          onConfirm={confirmAction}
        />
      </AnimatePresence>
    </>
  );
}
