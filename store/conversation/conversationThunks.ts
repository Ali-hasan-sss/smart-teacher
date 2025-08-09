import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import {
  ConversationResponse,
  MessageResponse,
  InstructionResponse,
  Message,
} from "@/types/conversation";

// جلب المحادثات حسب الكورس
export const fetchConversationsByCourse = createAsyncThunk<Message[], number>(
  "conversation/fetchByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get<ConversationResponse<Message>>(
        "/api/Client/Conversation/by-course",
        { params: { courseId } }
      );
      return res.data.data.items; // فقط المصفوفة
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء جلب المحادثات"
      );
    }
  }
);

// جلب الرسائل حسب الكورس
export const fetchMessagesByCourse = createAsyncThunk<
  ConversationResponse<Message>,
  number
>(
  "conversation/fetchMessagesByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get<ConversationResponse<Message>>(
        "/api/Client/Conversation/by-course/messages",
        { params: { courseId } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "حدث خطأ أثناء جلب الرسائل");
    }
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  { courseId: number; contentType: string; content: string }
>("conversation/sendMessage", async (messageData, { rejectWithValue }) => {
  try {
    const res = await axios.post<MessageResponse>(
      "/api/Client/Conversation/message",
      messageData
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "حدث خطأ أثناء إرسال الرسالة");
  }
});

// إرسال رسالة تعليمات
export const sendInstruction = createAsyncThunk<
  InstructionResponse,
  {
    reference: string;
    courseId: number;
    content: string;
    instractions: string[];
  }
>(
  "conversation/sendInstruction",
  async (instructionData, { rejectWithValue }) => {
    try {
      const res = await axios.post<InstructionResponse>(
        "/api/Client/Conversation/message/instruction",
        instructionData
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء إرسال التعليمات"
      );
    }
  }
);

// تعليم الرسالة بأنها تمت قراءتها / تعلمها
export const markMessageLearned = createAsyncThunk<
  MessageResponse,
  { courseId: number; contentType: string; content: string }
>("conversation/markLearned", async (learnedData, { rejectWithValue }) => {
  try {
    const res = await axios.post<MessageResponse>(
      "/api/Client/Conversation/message/learned",
      learnedData
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || "حدث خطأ أثناء تحديث حالة الرسالة"
    );
  }
});

// جلب الرسائل العامة
export const fetchGeneralMessages = createAsyncThunk<
  ConversationResponse<Message>,
  number
>(
  "conversation/fetchGeneralMessages",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axios.get<ConversationResponse<Message>>(
        "/api/Client/Conversation/General/messages",
        { params: { courseId } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء جلب الرسائل العامة"
      );
    }
  }
);

// إرسال رسالة عامة
export const sendGeneralMessage = createAsyncThunk<
  Message,
  { courseId: number; contentType: string; content: string }
>(
  "conversation/sendGeneralMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const res = await axios.post<MessageResponse>(
        "/api/Client/Conversation/General/message",
        messageData
      );
      return res.data.data; // هنا فقط بيانات الرسالة
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء إرسال الرسالة العامة"
      );
    }
  }
);
