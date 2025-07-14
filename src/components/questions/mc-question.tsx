import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { QuestionProps } from "@/@types/QuestionProps";
import { SearchTag } from "../search-tag";

interface MCQuestionProps {
  question: QuestionProps;
  updateQuestionText: (id: string, text: string) => void;
  updateQuestionOption: (id: string, index: number, text: string) => void;
  updateQuestionAnswer: (id: string, answer: number) => void;
}

export function MCQuestion({
  question,
  updateQuestionAnswer,
  updateQuestionOption,
  updateQuestionText,
}: MCQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {question.created_at && (
          <SearchTag questionId={question.id} questionTags={question.tags} />
        )}
        <Label htmlFor={`question-${question.id}-text`}>
          Pergunta <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id={`question-${question.id}-text`}
          placeholder="Digite a pergunta aqui..."
          value={question.title}
          onChange={(e) => updateQuestionText(question.id!, e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>
          Opções <span className="text-red-500">*</span>
        </Label>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <RadioGroup
              value={String(question.answer)}
              onValueChange={(value) =>
                updateQuestionAnswer(question.id!, parseInt(value))
              }
            >
              <RadioGroupItem
                value={String(index)}
                id={`q${question.id}-option-${index}`}
              />
            </RadioGroup>
            <Input
              placeholder={`Opção ${index + 1}`}
              value={option}
              onChange={(e) =>
                updateQuestionOption(question.id!, index, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
