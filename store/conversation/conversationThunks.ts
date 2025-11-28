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
  Message[],
  {
    courseId: number;
    contentType: string;
    content: string;
    imageUrls?: string[];
  }
>("conversation/sendMessage", async (messageData, { rejectWithValue }) => {
  try {
    const res = await axios.post<ConversationResponse<Message>>(
      "/api/Client/Conversation/message/with-images",
      messageData
    );
    return res.data.data.items;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "حدث خطأ أثناء إرسال الرسالة");
  }
});

// إرسال رسالة تعليمات
export const sendInstruction = createAsyncThunk<
  any,
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
  Message[],
  {
    courseId: number;
    contentType: string;
    content: string;
    imageUrls?: string[];
  }
>(
  "conversation/sendGeneralMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const res = await axios.post<ConversationResponse<Message>>(
        "/api/Client/Conversation/General/message/with-images",
        messageData
      );
      return res.data.data.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء إرسال الرسالة العامة"
      );
    }
  }
);

// حذف محادثة (حسب courseId أو 0 للمحادثة العامة)
export const deleteConversation = createAsyncThunk<
  { courseId: number },
  number
>("conversation/deleteConversation", async (courseId, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/Client/Conversation/${courseId}`);
    return { courseId };
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "حدث خطأ أثناء حذف المحادثة");
  }
});

// حذف رسائل متعددة
export const deleteMessages = createAsyncThunk<number[], number[]>(
  "conversation/deleteMessages",
  async (ids, { rejectWithValue }) => {
    try {
      await axios.post(`/api/Client/Conversation/Delete/Messages`, { ids });
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "حدث خطأ أثناء حذف الرسائل");
    }
  }
);

// إرسال تعليمات لأكثر من درس (توليد اختبار متعدد)
export const sendMultiCourseInstruction = createAsyncThunk<
  any,
  {
    courseId: number;
    contentType: string;
    instractions: string[];
    courseIds: number[];
    reference: string;
    content: string;
  }
>(
  "conversation/sendMultiCourseInstruction",
  async (instructionData, { rejectWithValue }) => {
    try {
      const res = await axios.post<InstructionResponse>(
        "/api/Client/Conversation/message/instruction/multi-course",
        instructionData
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "حدث خطأ أثناء إرسال التعليمات المتعددة"
      );
    }
  }
);

// إرسال نتيجة الاختبار
export const sendQuizResult = createAsyncThunk<
  any,
  {
    result: string;
    courseId: number;
  }
>("conversation/sendQuizResult", async (quizData, { rejectWithValue }) => {
  try {
    // إضافة timeout للتأكد من أن الطلب يظهر في Network
    const res = await axios.post("/api/Client/Course/QuizResult", quizData, {
      timeout: 10000, // 10 ثوان
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      // إضافة هذه الإعدادات لضمان ظهور الطلب في Network
      validateStatus: function (status) {
        return status >= 200 && status < 300; // default
      },
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || "حدث خطأ أثناء إرسال نتيجة الاختبار"
    );
  }
});
