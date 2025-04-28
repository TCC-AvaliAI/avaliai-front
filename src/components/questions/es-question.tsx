import { QuestionProps } from "@/@types/QuestionProps";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface ESQuestionProps {
  question: QuestionProps;
  questions: QuestionProps[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  updateQuestionText: (id: string, text: string) => void;
}

export function ESQuestion({
  question,
  questions,
  setQuestions,
  updateQuestionText,
}: ESQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
        <Textarea
          id={`question-${question.id}-text`}
          placeholder="Digite a pergunta aqui..."
          value={question.title}
          onChange={(e) => updateQuestionText(question.id!, e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}-answer`}>
          Resposta esperada (para correção)
        </Label>
        <Textarea
          id={`question-${question.id}-answer`}
          placeholder="Digite a resposta esperada aqui..."
          value={question.answer_text}
          onChange={(e) =>
            setQuestions(
              questions.map((q) =>
                q.id === question.id ? { ...q, answer_text: e.target.value } : q
              )
            )
          }
        />
      </div>
    </div>
  );
}
