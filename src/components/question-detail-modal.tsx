import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionProps } from "@/@types/QuestionProps";
import { Badge } from "./ui/badge";

interface QuestionDetailsModalProps {
  question: QuestionProps | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionDetailsModal({
  question,
  isOpen,
  onClose,
}: QuestionDetailsModalProps) {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-[95vw]
          max-h-[95vh]
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle>Detalhes da Questão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {question.tags.length > 0 ? (
                question.tags.map((tag) => (
                  <Badge
                    variant="secondary"
                    key={tag.name}
                    className="truncate max-w-full"
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium">Autor:</h3>
            <p className="text-muted-foreground">{question.author_name}</p>
          </div>
          <div>
            <h3 className="font-medium">Título:</h3>
            <p className="text-muted-foreground">{question.title}</p>
          </div>
          <div>
            <h3 className="font-medium">Resposta Correta:</h3>
            <p className="text-muted-foreground">
              {question.type === "ES"
                ? question.answer_text || "N/A"
                : question.options?.[question.answer] || "N/A"}
            </p>
          </div>

          {question.type === "MC" && question.options && (
            <div>
              <h3 className="font-medium">Opções:</h3>
              <ul className="list-disc pl-5 text-muted-foreground">
                {question.options.map((option, index) => (
                  <li key={index}>
                    {option} {index === question.answer && "(Resposta Correta)"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
