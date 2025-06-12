import { useState } from "react";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
import { v4 as uuidv4 } from "uuid";

export function useQuestions() {
  const [questions, setQuestions] = useState<QuestionProps[]>([]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuestionProps = {
      id: uuidv4(),
      title: "",
      score: 10,
      answer_text: "",
      user: "",
      answer: 0,
      options:
        type === "MC"
          ? ["", "", "", ""]
          : type === "TF"
          ? ["Verdadeiro", "Falso"]
          : [],
      type,
      author_name: "",
      tags: [],
      was_generated_by_ai: false,
      not_attached: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = { ...questionToDuplicate, id: uuidv4() };
      setQuestions([...questions, newQuestion]);
    }
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, title: text } : q))
    );
  };

  const updateQuestionOption = (
    id: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updatedOptions = [...q.options];
          updatedOptions[optionIndex] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const updateQuestionPoints = (id: string, points: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, score: Number.parseInt(points) || 1 } : q
      )
    );
  };

  const updateQuestionAnswer = (id: string, answer: number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  return {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    duplicateQuestion,
    updateQuestionText,
    updateQuestionOption,
    updateQuestionPoints,
    updateQuestionAnswer,
  };
}
