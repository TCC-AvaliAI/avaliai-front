import { SuggestionProps } from "@/@types/Message";
import { Button } from "./ui/button";

export function Suggestion({ text, onClick }: SuggestionProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs h-auto py-1.5 px-3 whitespace-normal text-left justify-start font-normal text-muted-foreground"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
