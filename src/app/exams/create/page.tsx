"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, GripVertical, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
import { Exam } from "@/@types/ExamProps";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";

type DifficultyLevel = "easy" | "medium" | "hard";

interface SuggestedQuestion {
  id: number;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  subject: string;
}
type DisciplineProps = {
  id: string;
  name: string;
  user: string;
};
type ClassroomProps = {
  id: string;
  code: string;
  name: string;
  user: string;
};

export default function CreateExamPage() {
  const { data: session } = useSession();

  const suggestedQuestions: Record<DifficultyLevel, SuggestedQuestion[]> = {
    easy: [
      {
        id: 1,
        text: "Qual é a capital do Brasil?",
        type: "MC",
        difficulty: "easy",
        subject: "Geografia",
      },
      {
        id: 2,
        text: "Quanto é 2 + 2?",
        type: "MC",
        difficulty: "easy",
        subject: "Matemática",
      },
      {
        id: 3,
        text: "A água ferve a 100°C ao nível do mar.",
        type: "TF",
        difficulty: "easy",
        subject: "Ciências",
      },
    ],
    medium: [
      {
        id: 4,
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        type: "MC",
        difficulty: "medium",
        subject: "Matemática",
      },
      {
        id: 5,
        text: "Quais são os estados físicos da matéria?",
        type: "MC",
        difficulty: "medium",
        subject: "Ciências",
      },
      {
        id: 6,
        text: "Explique o processo de fotossíntese.",
        type: "ES",
        difficulty: "medium",
        subject: "Biologia",
      },
    ],
    hard: [
      {
        id: 7,
        text: "Resolva a integral ∫(x²+2x+1)dx",
        type: "ES",
        difficulty: "hard",
        subject: "Matemática",
      },
      {
        id: 8,
        text: "Explique o princípio da incerteza de Heisenberg.",
        type: "ES",
        difficulty: "hard",
        subject: "Física",
      },
      {
        id: 9,
        text: "Quais dos seguintes compostos são ácidos fortes?",
        type: "ES",
        difficulty: "hard",
        subject: "Química",
      },
    ],
  };

  const [questions, setQuestions] = useState<QuestionProps[]>([
    {
      type: "TF",
      title: "Título da questão",
      options: ["Verdadeiro", "Falso"],
      answer: 0,
      score: 10,
      answer_text: "",
      created_at: "",
      user: "",
    },
  ]);

  const [examInfo, setExamInfo] = useState<Exam>({
    id: "",
    user: "",
    title: "",
    duration: 0,
    score: 0,
    created_at: "",
    applied_at: "",
    qr_code: "",
    description: "",
    theme: "",
    was_generated_by_ai: false,
    difficulty: "medium",
    status: "PENDING",
    discipline: "",
    classroom: "",
    questions: [],
  });

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuestionProps = {
      id: uuidv4(),
      title: "",
      score: 10,
      answer_text: "",
      created_at: "",
      user: "",
      answer: 0,
      options: [],
      type,
    };

    if (type === "MC") {
      newQuestion.options = ["", "", "", ""];
    } else if (type === "TF") {
      newQuestion.options = ["Verdadeiro", "Falso"];
    }
    setQuestions([...questions, newQuestion]);
  };

  const addSuggestedQuestion = (question: SuggestedQuestion) => {
    const newQuestion: QuestionProps = {
      id: uuidv4(),
      title: question.text,
      score: 10,
      answer_text: "",
      created_at: "",
      user: "",
      answer: 0,
      options: [],
      type: question.type,
    };

    if (question.type === "MC") {
      newQuestion.options = ["Opção 1", "Opção 2", "Opção 3", "Opção 4"];
      newQuestion.answer = 1;
    } else if (question.type === "TF") {
      newQuestion.options = ["Verdadeiro", "Falso"];
      newQuestion.answer = 1;
    } else if (question.type === "ES") {
      newQuestion.answer = 0;
    }

    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: String(questions.length + 1),
      };
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

  const renderQuestionEditor = (question: QuestionProps) => {
    switch (question.type) {
      case "MC":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Opções</Label>
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
      case "TF":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Afirmação</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a afirmação aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
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
      case "ES":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
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
                      q.id === question.id
                        ? { ...q, answer_text: e.target.value }
                        : q
                    )
                  )
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const { data: disciplines } = useSWR(
    `/disciplines/?user=${session?.id}`,
    fetcher
  );
  const { data: classrooms } = useSWR(
    `/classrooms/?user=${session?.id}`,
    fetcher
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Criar Nova Prova
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-title">Título da Prova</Label>
                    <Input
                      id="exam-title"
                      placeholder="Ex: Avaliação de Matemática - 2º Bimestre"
                      value={examInfo.title}
                      onChange={(e) =>
                        setExamInfo({ ...examInfo, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-subject">Disciplina</Label>
                      <Select
                        value={examInfo.discipline}
                        onValueChange={(value) =>
                          setExamInfo({ ...examInfo, discipline: value })
                        }
                      >
                        <SelectTrigger id="exam-subject">
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {disciplines?.map((discipline: DisciplineProps) => (
                            <SelectItem
                              key={discipline.id}
                              value={discipline.id}
                            >
                              {discipline.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-grade">Série/Turma</Label>
                      <Select
                        value={examInfo.classroom}
                        onValueChange={(value) =>
                          setExamInfo({ ...examInfo, classroom: value })
                        }
                      >
                        <SelectTrigger id="exam-grade">
                          <SelectValue placeholder="Selecione a turma" />
                        </SelectTrigger>
                        <SelectContent>
                          {classrooms?.map((classroom: ClassroomProps) => (
                            <SelectItem key={classroom.id} value={classroom.id}>
                              {classroom.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-difficulty">
                        Nível de Dificuldade
                      </Label>
                      <Select
                        value={examInfo.difficulty}
                        onValueChange={(value: DifficultyLevel) =>
                          setExamInfo({ ...examInfo, difficulty: value })
                        }
                      >
                        <SelectTrigger id="exam-difficulty">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-duration">Duração (minutos)</Label>
                      <Input
                        id="exam-duration"
                        type="number"
                        min="1"
                        value={examInfo.duration}
                        onChange={(e) =>
                          setExamInfo({
                            ...examInfo,
                            duration: Number.parseInt(e.target.value) || 60,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exam-description">
                      Descrição/Instruções
                    </Label>
                    <Textarea
                      id="exam-description"
                      placeholder="Instruções para os alunos..."
                      value={examInfo.description}
                      onChange={(e) =>
                        setExamInfo({
                          ...examInfo,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {questions.map((question, index) => (
              <Card key={question.title} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <h3 className="font-medium">Questão {index + 1}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor={`question-${question.id}-points`}
                          className="text-sm"
                        >
                          Pontos:
                        </Label>
                        <Input
                          id={`question-${question.id}-points`}
                          type="number"
                          min="1"
                          className="w-16 h-8"
                          value={question.score}
                          onChange={(e) =>
                            updateQuestionPoints(question.id!, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateQuestion(question.id!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {renderQuestionEditor(question)}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <Card className="w-full">
                <CardContent className="justify-center items-center">
                  <div className="flex justify-around">
                    <Button variant="outline" onClick={() => addQuestion("MC")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Múltipla Escolha
                    </Button>
                    <Button variant="outline" onClick={() => addQuestion("TF")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Verdadeiro/Falso
                    </Button>
                    <Button variant="outline" onClick={() => addQuestion("ES")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dissertativa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Sugestões de Questões</h3>
                <Tabs defaultValue={examInfo.difficulty}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="easy">Fácil</TabsTrigger>
                    <TabsTrigger value="medium">Médio</TabsTrigger>
                    <TabsTrigger value="hard">Difícil</TabsTrigger>
                  </TabsList>
                  {Object.entries(suggestedQuestions).map(
                    ([difficulty, questions]) => (
                      <TabsContent
                        key={difficulty}
                        value={difficulty}
                        className="space-y-4 mt-4"
                      >
                        {questions.map((question) => (
                          <div
                            key={question.id}
                            className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => addSuggestedQuestion(question)}
                          >
                            <p className="font-medium text-sm">
                              {question.subject}: {question.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tipo:{" "}
                              {question.type === "MC"
                                ? "Múltipla Escolha"
                                : question.type === "TF"
                                ? "Verdadeiro/Falso"
                                : "Dissertativa"}
                            </p>
                          </div>
                        ))}
                      </TabsContent>
                    )
                  )}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Resumo da Prova</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de questões:</span>
                    <span className="text-sm font-medium">
                      {questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pontuação total:</span>
                    <span className="text-sm font-medium">
                      {questions.reduce((sum, q) => sum + (q.score || 1), 0)}{" "}
                      pontos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duração estimada:</span>
                    <span className="text-sm font-medium">
                      {examInfo.duration} minutos
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
