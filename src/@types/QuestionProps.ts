export interface QuestionProps {
  id: string;
  title: string;
  options: string[];
  answer: number;
  answer_text: string;
  score: number;
  type: "MC" | "TF" | "ES";
  user: string;
}
