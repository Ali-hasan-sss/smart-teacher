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

      .addCase(
        fetchMessagesByCourse.fulfilled,
        (state, action: PayloadAction<ConversationResponse<Message>>) => {
          state.messages = action.payload.data.items;
        }
      )

      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.messages.push(action.payload);
        }
      )

      .addCase(
        fetchGeneralMessages.fulfilled,
        (state, action: PayloadAction<ConversationResponse<Message>>) => {
          state.messages = action.payload.data.items;
        }
      )

      .addCase(
        sendGeneralMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.messages.push(action.payload);
        }
      );
  },
});

export default conversationSlice.reducer;
