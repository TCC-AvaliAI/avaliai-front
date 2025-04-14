import { QuestionProps } from "./QuestionProps";

export type ExamStatus = "APPLIED" | "PENDING" | "CANCELLED" | "ARCHIVED";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Exam {
  id: string;
  user: string;
  title: string;
  duration: number;
  score: number;
  created_at: string;
  applied_at: string | null;
  qr_code: string | null;
  description: string;
  theme: string;
  was_generated_by_ai: boolean;
  difficulty: DifficultyLevel;
  status: ExamStatus;
  discipline: string;
  classroom: string;
  questions: QuestionProps[];
}
