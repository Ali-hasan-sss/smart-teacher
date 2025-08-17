import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchConversationsByCourse,
  fetchMessagesByCourse,
  sendMessage,
  sendInstruction,
  markMessageLearned,
  fetchGeneralMessages,
  sendGeneralMessage,
} from "./conversationThunks";
import { ConversationResponse, Message } from "@/types/conversation";

interface ConversationState {
  conversations: any[];
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  messages: [],
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
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

      // ================== General Messages ==================
      .addCase(
        fetchGeneralMessages.fulfilled,
        (state, action: PayloadAction<ConversationResponse<Message>>) => {
          state.messages = action.payload.data.items;
        }
      )
      .addCase(sendGeneralMessage.pending, (state, action) => {
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
        sendGeneralMessage.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
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
      );
  },
});

export default conversationSlice.reducer;
