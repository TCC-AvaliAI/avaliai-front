export type MessageRole = "assistant" | "user";

export interface AIAssistantProps {
  className?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface SuggestionProps {
  text: string;
  onClick: () => void;
}
