export type MessageRole = "assistant" | "user";

export interface AIAssistantProps {
  className?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface SuggestionProps {
  text: string;
  onClick: () => void;
}

export interface ResponseMessage {
  user_message: Message;
  assistant_message: Message;
}