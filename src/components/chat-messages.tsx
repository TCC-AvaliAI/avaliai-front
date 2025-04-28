import { BotMessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/@types/Message";
import { Session } from "next-auth";

export function ChatMessage({
  message,
  session,
}: {
  message: Message;
  session: Session | null;
}) {
  const isAssistant = message.role === "assistant";
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-4",
        isAssistant ? "pr-4" : "pl-4",
        !isAssistant && "justify-end"
      )}
    >
      {isAssistant && (
        <Avatar className="flex items-center justify-center h-8 w-8 bg-primary/10">
          <BotMessageSquare className="h-4 w-4 text-primary" />
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          !isAssistant && "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isAssistant
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {!isAssistant && (
        <Avatar className="flex items-center justify-center h-8 w-8 bg-primary">
          {session ? (
            <>
              <AvatarImage src={session.image} alt={session.name} />
              <AvatarFallback>{session.name}</AvatarFallback>
            </>
          ) : (
            <User className="h-4 w-4 text-primary-foreground" />
          )}
        </Avatar>
      )}
    </div>
  );
}
