import { QuestionProps } from "@/@types/QuestionProps";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

interface TFQuestionProps {
  question: QuestionProps;
  updateQuestionText: (id: string, text: string) => void;
  updateQuestionAnswer: (id: string, answer: number) => void;
}

export function TFQuestion({
  question,
  updateQuestionAnswer,
  updateQuestionText,
}: TFQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}-text`}>Afirmação</Label>
        <Textarea
          id={`question-${question.id}-text`}
          placeholder="Digite a afirmação aqui..."
          value={question.title}
          onChange={(e) => updateQuestionText(question.id!, e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Resposta correta</Label>
        <RadioGroup
          value={String(question.answer)}
          onValueChange={(value) =>
            updateQuestionAnswer(question.id!, parseInt(value))
          }
          className="flex space-x-4"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(index)}
                id={`q${question.id}-option-${index}`}
              />
              <Label htmlFor={`q${question.id}-option-${index}`}>
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
