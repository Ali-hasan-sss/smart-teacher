import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversationsByCourse,
  fetchMessagesByCourse,
  sendMessage,
  sendInstruction,
  markMessageLearned,
  fetchGeneralMessages,
  sendGeneralMessage,
  deleteMessages,
  deleteConversation,
  sendMultiCourseInstruction,
  sendQuizResult,
} from "./conversationThunks";
import {
  ConversationResponse,
  InstructionResponse,
  Message,
} from "@/types/conversation";

interface ConversationState {
  conversations: any[];
  messages: Message[];
  loading: boolean;
  sendingMessage: boolean;
  sendingInstruction: boolean;
  sendingMultiCourseInstruction: boolean;
  sendingQuizResult: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  messages: [],
  loading: false,
  sendingMessage: false,
  sendingInstruction: false,
  sendingMultiCourseInstruction: false,
  sendingQuizResult: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ================== Conversations ==================
      .addCase(fetchConversationsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchConversationsByCourse.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.loading = false;
          state.conversations = action.payload;
        }
      )
      .addCase(fetchConversationsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ================== Messages ==================
      .addCase(
        fetchMessagesByCourse.fulfilled,
        (state, action: PayloadAction<ConversationResponse<Message>>) => {
          state.messages = action.payload.data.items;
        }
      )

      // ================== Send Message ==================
      .addCase(sendMessage.pending, (state, action) => {
        state.sendingMessage = true;
        const { content, contentType } = action.meta.arg;

        // push user message
        state.messages.push({
          id: Date.now(),
          messageType: "Question",
          contentType: contentType === "AUDIO" ? "Audio" : "Text",
          content,
          audioFile: null,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          order: state.messages.length + 1,
        });

        // push typing bubble
        state.messages.push({
          id: Date.now() + 1,
          messageType: "Answer",
          contentType: "Text",
          content: null,
          audioFile: null,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          order: state.messages.length + 2,
        });
      })

      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.sendingMessage = false;
          const payload = action.payload;

          // لاقي السؤال اللي رجع من السيرفر
          const serverQuestion = payload.find(
            (p) => p.messageType === "Question"
          );
          const serverAnswer = payload.find((p) => p.messageType === "Answer");

          // شيل الـ loader (Answer الفاضي)
          const answerIndex = state.messages.findIndex(
            (m) => m.messageType === "Answer" && !m.content
          );

          if (answerIndex !== -1) {
            if (serverAnswer) {
              state.messages[answerIndex] = {
                ...state.messages[answerIndex],
                ...serverAnswer,
              };
            }
          }

          // لو السؤال موجود أصلاً في state → ما تضيفهوش تاني
          if (
            serverQuestion &&
            !state.messages.some((m) => m.id === serverQuestion.id)
          ) {
            // استبدل السؤال المحلي (id مؤقت Date.now) بالسؤال الحقيقي
            const localQuestionIndex = state.messages.findIndex(
              (m) =>
                m.messageType === "Question" &&
                m.content === serverQuestion.content
            );
            if (localQuestionIndex !== -1) {
              state.messages[localQuestionIndex] = serverQuestion;
            } else {
              state.messages.unshift(serverQuestion);
            }
          }

          // لو في أي رسائل إضافية غير السؤال والجواب
          const extra = payload.filter(
            (p) => p.messageType !== "Answer" && p.messageType !== "Question"
          );
          if (extra.length > 0) {
            state.messages.push(...extra);
          }
        }
      )
      .addCase(sendMessage.rejected, (state) => {
        state.sendingMessage = false;
      })
      // ================== General Messages ==================
      .addCase(
        fetchGeneralMessages.fulfilled,
        (state, action: PayloadAction<ConversationResponse<Message>>) => {
          state.messages = action.payload.data.items;
        }
      )
      .addCase(sendGeneralMessage.pending, (state, action) => {
        state.sendingMessage = true;
        const { content, contentType } = action.meta.arg;

        // push user message
        state.messages.push({
          id: Date.now(),
          messageType: "Question",
          contentType: contentType === "AUDIO" ? "Audio" : "Text",
          content,
          audioFile: null,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          order: state.messages.length + 1,
        });

        // push typing bubble
        state.messages.push({
          id: Date.now() + 1,
          messageType: "Answer",
          contentType: "Text",
          content: "",
          audioFile: null,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          order: state.messages.length + 2,
        });
      })
      .addCase(
        sendGeneralMessage.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.sendingMessage = false;
          const payload = action.payload;

          const serverQuestion = payload.find(
            (p) => p.messageType === "Question"
          );
          const serverAnswer = payload.find((p) => p.messageType === "Answer");

          // شيل الـ loader (Answer الفاضي)
          const answerIndex = state.messages.findIndex(
            (m) => m.messageType === "Answer" && !m.content
          );

          if (answerIndex !== -1) {
            if (serverAnswer) {
              state.messages[answerIndex] = {
                ...state.messages[answerIndex],
                ...serverAnswer,
              };
            }
          }

          // لو السؤال موجود أصلاً في state → ما تضيفهوش تاني
          if (
            serverQuestion &&
            !state.messages.some((m) => m.id === serverQuestion.id)
          ) {
            // استبدل السؤال المحلي (id مؤقت Date.now) بالسؤال الحقيقي
            const localQuestionIndex = state.messages.findIndex(
              (m) =>
                m.messageType === "Question" &&
                m.content === serverQuestion.content
            );
            if (localQuestionIndex !== -1) {
              state.messages[localQuestionIndex] = serverQuestion;
            } else {
              state.messages.unshift(serverQuestion);
            }
          }

          // لو في أي رسائل إضافية غير السؤال والجواب
          const extra = payload.filter(
            (p) => p.messageType !== "Answer" && p.messageType !== "Question"
          );
          if (extra.length > 0) {
            state.messages.push(...extra);
          }
        }
      )
      .addCase(sendGeneralMessage.rejected, (state) => {
        state.sendingMessage = false;
      })
      // ================== Send Instruction ==================
      .addCase(sendInstruction.pending, (state, action) => {
        state.sendingInstruction = true; // ✅ بدء الإرسال
      })
      .addCase(sendInstruction.fulfilled, (state, action) => {
        state.sendingInstruction = false;
        const text =
          typeof action.payload.data === "string" ? action.payload.data : "";

        if (text) {
          state.messages.push({
            id: Date.now(),
            messageType: "Answer",
            contentType: "Text",
            content: text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: state.messages.length + 1,
            audioFile: null,
          });
        }
      })
      .addCase(sendInstruction.rejected, (state) => {
        state.sendingInstruction = false;
      })
      // ================== Delete Conversation ==================
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const { courseId } = action.payload;

        if (courseId === 0) {
          state.messages = [];
        } else {
          state.conversations = state.conversations.filter(
            (conv: any) => conv.courseId !== courseId
          );
          state.messages = [];
        }
      })

      // ================== Delete Messages ==================
      .addCase(deleteMessages.fulfilled, (state, action) => {
        const ids = action.payload;
        state.messages = state.messages.filter((msg) => !ids.includes(msg.id));
      })

      // ================== Send Multi-Course Instruction ==================
      .addCase(sendMultiCourseInstruction.pending, (state) => {
        state.sendingMultiCourseInstruction = true;
        state.error = null;
      })
      .addCase(sendMultiCourseInstruction.fulfilled, (state, action) => {
        state.sendingMultiCourseInstruction = false;
        const text =
          typeof action.payload.data === "string" ? action.payload.data : "";

        if (text) {
          state.messages.push({
            id: Date.now(),
            messageType: "Answer",
            contentType: "Text",
            content: text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: state.messages.length + 1,
            audioFile: null,
          });
        }
      })
      .addCase(sendMultiCourseInstruction.rejected, (state, action) => {
        state.sendingMultiCourseInstruction = false;
        state.error = action.payload as string;
      })

      // ================== Send Quiz Result ==================
      .addCase(sendQuizResult.pending, (state) => {
        state.sendingQuizResult = true;
        state.error = null;
      })
      .addCase(sendQuizResult.fulfilled, (state, action) => {
        state.sendingQuizResult = false;
      })
      .addCase(sendQuizResult.rejected, (state, action) => {
        state.sendingQuizResult = false;
        state.error = action.payload as string;
      });
  },
});
export const { addMessage, updateMessage } = conversationSlice.actions;

export default conversationSlice.reducer;
