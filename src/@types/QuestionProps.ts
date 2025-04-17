export interface QuestionProps {
  id?: string;
  title: string;
  options: string[];
  answer: number;
  answer_text: string;
  score: number;
  type: QuestionType;
  user: string;
  created_at: string;
}

export type QuestionType = "MC" | "TF" | "ES";
