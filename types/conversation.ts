// types/conversation.ts

export interface Message {
  id: number;
  messageType: "Question" | "Answer";
  contentType: "Text" | "Audio";
  createdAt: string;
  updatedAt: string | null;
  audioFile: string | null;
  content: string | null;
  order: number;
}

export interface ConversationData {
  title: string;
  id: number;
  messages: Message[];
}

export interface ConversationResponse<T> {
  data: {
    items: T[];
  };
  isSuccess: boolean;
  message: string;
  code: number;
}

// استجابة POST /message أو /General/message
export interface MessageResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: Message;
}

// استجابة POST /message/instruction
export interface InstructionResponse {
  isSuccess: boolean;
  message: string;
  code: number;
  data: string;
}
