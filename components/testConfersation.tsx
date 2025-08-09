"use client";
import { AppDispatch, RootState } from "@/store";
import {
  fetchConversationsByCourse,
  fetchMessagesByCourse,
  sendMessage,
  sendGeneralMessage,
  fetchGeneralMessages,
} from "@/store/conversation/conversationThunks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ChatComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, conversations, loading, error } = useSelector(
    (state: RootState) => state.conversation
  );
  const [courseId] = useState<number>(1);
  const [messageContent, setMessageContent] = useState("");

  // جلب المحادثات عند التحميل
  useEffect(() => {
    dispatch(fetchConversationsByCourse(courseId));
    dispatch(fetchMessagesByCourse(courseId));
    dispatch(fetchGeneralMessages(courseId));
  }, [dispatch, courseId]);

  const handleSendCourseMessage = () => {
    if (!messageContent.trim()) return;
    dispatch(
      sendMessage({
        courseId,
        contentType: "Text",
        content: messageContent,
      })
    );
    setMessageContent("");
  };

  const handleSendGeneralMessage = () => {
    if (!messageContent.trim()) return;
    dispatch(
      sendGeneralMessage({
        courseId,
        contentType: "Text",
        content: messageContent,
      })
    );
    setMessageContent("");
  };

  if (loading) return <p>جار التحميل...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>المحادثة الخاصة بالكورس {courseId}</h2>
      {conversations && (
        <p>
          <strong>عنوان المحادثة:</strong> {conversations[0].title || " "}
        </p>
      )}
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            {msg.contentType === "Text" ? msg.content : "[ملف صوتي]"}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="اكتب رسالتك..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <div>
        <button onClick={handleSendCourseMessage}>إرسال رسالة للكورس</button>
        <button onClick={handleSendGeneralMessage}>إرسال رسالة عامة</button>
      </div>
    </div>
  );
}
