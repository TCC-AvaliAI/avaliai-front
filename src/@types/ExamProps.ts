import { Classroom } from "./ClassroomProps";
import { Discipline } from "./DisciplinesProps";
import { QuestionProps } from "./QuestionProps";

export type ExamStatus = "Aplicada" | "Pendente" | "Cancelada" | "Arquivada";
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
  discipline: Discipline;
  classroom: Classroom;
  questions: QuestionProps[];
}
