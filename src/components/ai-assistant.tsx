"use client";

import { useState, useRef, useEffect } from "react";
import { Send, BotMessageSquare, Loader2, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import {
  AIAssistantProps,
  Message,
  MessageRole,
  ResponseMessage,
} from "@/@types/Message";
import { ChatMessage } from "./chat-messages";
import { Suggestion } from "./sugestion-quetions";
import api from "@/lib/axios";

export function AIAssistant({ className }: AIAssistantProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "default",
      role: "assistant" as MessageRole,
      content: "Como posso ajudar você com seu exame?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && !isMinimized) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobile, isMinimized]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input;
    if (!messageContent.trim() || isLoading) return;
    try {
      setIsLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          id: generateUUID(),
          role: "user" as MessageRole,
          content: messageContent,
          timestamp: new Date().toISOString(),
        },
      ]);
      const reponse = await api.post("/messages/", {
        content: `Answer directly and briefly and in Portuguese: ${messageContent}`,
        model: "default",
      });
      const { assistant_message } = reponse.data as ResponseMessage;
      setMessages((prev) => [...prev, assistant_message]);
      setInput("");
      setIsLoading(false);
    } catch (error) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    setMessages(messages.slice(0, 1));
  };

  const getSuggestions = () => {
    return [
      "Qual foi o estopim da segunda guerra?",
      "Qual a formula de Bhaskara?",
      "Como funciona a fotossíntese?",
    ];
  };

  if (isMinimized) {
    return (
      <div
        className={cn(
          isMobile
            ? "fixed bottom-6 right-4 left-auto z-50"
            : "fixed bottom-4 right-4 z-50",
          className
        )}
      >
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsMinimized(false)}
        >
          <BotMessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        isMobile
          ? "fixed inset-0 z-50 flex flex-col bg-background border-none rounded-none shadow-none w-full h-full"
          : "fixed bottom-4 right-4 z-50 flex flex-col w-80 h-96 bg-background border rounded-lg shadow-lg overflow-auto scrollbar-hide",
        className
      )}
      style={isMobile ? { maxWidth: "100vw", maxHeight: "100vh" } : {}}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b bg-muted/50",
          isMobile && "rounded-none"
        )}
      >
        <div className="flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-sm">Assistente AvaliAi</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleClearChat}
            title="Limpar conversa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className={cn("flex-1", isMobile && "px-0 py-0")}>
        <div className={cn("flex flex-col p-2", isMobile && "p-2")}>
          <div className="flex flex-col gap-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                session={session}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 py-2 px-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">
                  Pesquisando...
                </span>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} className="h-px" />
        </div>

        {messages.length <= 2 && isMobile && (
          <div
            className={cn(
              "px-4 py-3 border-t bg-muted/30",
              "absolute left-0 right-0 bottom-[64px] z-50"
            )}
            style={{ width: "100vw" }}
          >
            <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {getSuggestions().map((suggestion, index) => (
                <Suggestion
                  key={index}
                  text={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {messages.length <= 2 && !isMobile && (
        <div className={cn("px-3 py-2 border-t bg-muted/30")}>
          <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map((suggestion, index) => (
              <Suggestion
                key={index}
                text={suggestion}
                onClick={() => handleSuggestion(suggestion)}
              />
            ))}
          </div>
        </div>
      )}
      <div
        className={cn(
          "p-3 border-t",
          isMobile &&
            "fixed bottom-0 left-0 right-0 bg-background border-t z-50 flex-shrink-0"
        )}
        style={isMobile ? { width: "100vw" } : {}}
      >
        <div className="flex items-center gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
            className={cn("min-h-9 resize-none", isMobile && "w-full")}
            rows={isMobile ? 2 : 3}
          />
          <Button
            size="icon"
            className={cn("h-9 w-9 shrink-0", isMobile && "h-12 w-12")}
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
