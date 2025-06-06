export interface QuestionProps {
  id: string;
  title: string;
  options: string[];
  answer: number;
  answer_text: string;
  score: number;
  type: QuestionType;
  user: string;
  created_at: string;
  was_generated_by_ai: boolean;
  not_attached?: boolean;
  author_name: string;
  tags: {
    id: string;
    name: string;
  }[];
}

export type QuestionType = "MC" | "TF" | "ES";
