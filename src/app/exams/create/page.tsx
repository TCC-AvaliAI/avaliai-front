"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Save,
  Download,
  QrCode,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";

// Definição dos tipos
type QuestionType = "multiple-choice" | "true-false" | "checkbox" | "essay";
type DifficultyLevel = "easy" | "medium" | "hard";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: Option[];
  answer?: string;
  answers?: number[];
  maxLength?: number;
  points: number;
}

interface ExamInfo {
  title: string;
  subject: string;
  grade: string;
  difficulty: DifficultyLevel;
  isOnline: boolean;
  description: string;
  duration: number;
}

interface SuggestedQuestion {
  id: number;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  subject: string;
}

export default function CreateExamPage() {
  // Dados simulados para sugestões de questões
  const suggestedQuestions: Record<DifficultyLevel, SuggestedQuestion[]> = {
    easy: [
      {
        id: 1,
        text: "Qual é a capital do Brasil?",
        type: "multiple-choice",
        difficulty: "easy",
        subject: "Geografia",
      },
      {
        id: 2,
        text: "Quanto é 2 + 2?",
        type: "multiple-choice",
        difficulty: "easy",
        subject: "Matemática",
      },
      {
        id: 3,
        text: "A água ferve a 100°C ao nível do mar.",
        type: "true-false",
        difficulty: "easy",
        subject: "Ciências",
      },
    ],
    medium: [
      {
        id: 4,
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        type: "multiple-choice",
        difficulty: "medium",
        subject: "Matemática",
      },
      {
        id: 5,
        text: "Quais são os estados físicos da matéria?",
        type: "checkbox",
        difficulty: "medium",
        subject: "Ciências",
      },
      {
        id: 6,
        text: "Explique o processo de fotossíntese.",
        type: "essay",
        difficulty: "medium",
        subject: "Biologia",
      },
    ],
    hard: [
      {
        id: 7,
        text: "Resolva a integral ∫(x²+2x+1)dx",
        type: "essay",
        difficulty: "hard",
        subject: "Matemática",
      },
      {
        id: 8,
        text: "Explique o princípio da incerteza de Heisenberg.",
        type: "essay",
        difficulty: "hard",
        subject: "Física",
      },
      {
        id: 9,
        text: "Quais dos seguintes compostos são ácidos fortes?",
        type: "checkbox",
        difficulty: "hard",
        subject: "Química",
      },
    ],
  };

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "multiple-choice",
      text: "",
      options: [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ],
      answer: "",
      points: 1,
    },
  ]);

  const [examInfo, setExamInfo] = useState<ExamInfo>({
    title: "",
    subject: "",
    grade: "",
    difficulty: "medium",
    isOnline: true,
    description: "",
    duration: 60,
  });

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      text: "",
      points: 1,
    };

    if (type === "multiple-choice") {
      newQuestion.options = [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ];
      newQuestion.answer = "";
    } else if (type === "true-false") {
      newQuestion.options = [
        { id: 1, text: "Verdadeiro" },
        { id: 2, text: "Falso" },
      ];
      newQuestion.answer = "";
    } else if (type === "checkbox") {
      newQuestion.options = [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ];
      newQuestion.answers = [];
    } else if (type === "essay") {
      newQuestion.answer = "";
      newQuestion.maxLength = 500;
    }

    setQuestions([...questions, newQuestion]);
  };

  const addSuggestedQuestion = (question: SuggestedQuestion) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: question.type,
      text: question.text,
      points: 1,
    };

    if (question.type === "multiple-choice") {
      newQuestion.options = [
        { id: 1, text: "Opção 1" },
        { id: 2, text: "Opção 2" },
        { id: 3, text: "Opção 3" },
        { id: 4, text: "Opção 4" },
      ];
      newQuestion.answer = "";
    } else if (question.type === "true-false") {
      newQuestion.options = [
        { id: 1, text: "Verdadeiro" },
        { id: 2, text: "Falso" },
      ];
      newQuestion.answer = "";
    } else if (question.type === "checkbox") {
      newQuestion.options = [
        { id: 1, text: "Opção 1" },
        { id: 2, text: "Opção 2" },
        { id: 3, text: "Opção 3" },
        { id: 4, text: "Opção 4" },
      ];
      newQuestion.answers = [];
    } else if (question.type === "essay") {
      newQuestion.answer = "";
      newQuestion.maxLength = 500;
    }

    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (id: number) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = { ...questionToDuplicate, id: questions.length + 1 };
      setQuestions([...questions, newQuestion]);
    }
  };

  const updateQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const updateQuestionOption = (
    id: number,
    optionId: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id && q.options) {
          const newOptions = q.options.map((opt) =>
            opt.id === optionId ? { ...opt, text: value } : opt
          );
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const updateQuestionPoints = (id: number, points: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, points: Number.parseInt(points) || 1 } : q
      )
    );
  };

  const updateQuestionAnswer = (id: number, answer: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const updateQuestionCheckboxAnswer = (
    id: number,
    optionId: number,
    checked: boolean
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          let newAnswers = q.answers || [];
          if (checked) {
            newAnswers = [...newAnswers, optionId];
          } else {
            newAnswers = newAnswers.filter((a) => a !== optionId);
          }
          return { ...q, answers: newAnswers };
        }
        return q;
      })
    );
  };

  const renderQuestionEditor = (question: Question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) =>
                  updateQuestionText(question.id, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Opções</Label>
              {question.options?.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <RadioGroup
                    value={question.answer || ""}
                    onValueChange={(value) =>
                      updateQuestionAnswer(question.id, value)
                    }
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`q${question.id}-option-${option.id}`}
                    />
                  </RadioGroup>
                  <Input
                    placeholder={`Opção ${option.id}`}
                    value={option.text}
                    onChange={(e) =>
                      updateQuestionOption(
                        question.id,
                        option.id,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "true-false":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Afirmação</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a afirmação aqui..."
                value={question.text}
                onChange={(e) =>
                  updateQuestionText(question.id, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Resposta correta</Label>
              <RadioGroup
                value={question.answer || ""}
                onValueChange={(value) =>
                  updateQuestionAnswer(question.id, value)
                }
                className="flex space-x-4"
              >
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`q${question.id}-option-${option.id}`}
                    />
                    <Label htmlFor={`q${question.id}-option-${option.id}`}>
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) =>
                  updateQuestionText(question.id, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Opções (marque as corretas)</Label>
              {question.options?.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={`q${question.id}-option-${option.id}`}
                    checked={(question.answers || []).includes(option.id)}
                    onCheckedChange={(checked) =>
                      updateQuestionCheckboxAnswer(
                        question.id,
                        option.id,
                        checked === true
                      )
                    }
                  />
                  <Input
                    placeholder={`Opção ${option.id}`}
                    value={option.text}
                    onChange={(e) =>
                      updateQuestionOption(
                        question.id,
                        option.id,
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "essay":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) =>
                  updateQuestionText(question.id, e.target.value)
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
                value={question.answer || ""}
                onChange={(e) =>
                  updateQuestionAnswer(question.id, e.target.value)
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
                      <Input
                        id="exam-subject"
                        placeholder="Ex: Matemática"
                        value={examInfo.subject}
                        onChange={(e) =>
                          setExamInfo({ ...examInfo, subject: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-grade">Série/Turma</Label>
                      <Input
                        id="exam-grade"
                        placeholder="Ex: 2º Ano - Turma A"
                        value={examInfo.grade}
                        onChange={(e) =>
                          setExamInfo({ ...examInfo, grade: e.target.value })
                        }
                      />
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="exam-online"
                        checked={examInfo.isOnline}
                        onCheckedChange={(checked) =>
                          setExamInfo({ ...examInfo, isOnline: checked })
                        }
                      />
                      <Label htmlFor="exam-online">Prova Online</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {examInfo.isOnline
                        ? "A prova será aplicada online e as respostas serão coletadas digitalmente."
                        : "A prova será impressa para aplicação presencial."}
                    </p>
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
              <Card key={question.id} className="relative">
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
                          value={question.points}
                          onChange={(e) =>
                            updateQuestionPoints(question.id, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateQuestion(question.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id)}
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
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => addQuestion("multiple-choice")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Múltipla Escolha
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addQuestion("true-false")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Verdadeiro/Falso
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addQuestion("checkbox")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Caixas de Seleção
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => addQuestion("essay")}
                    >
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
                              {question.type === "multiple-choice"
                                ? "Múltipla Escolha"
                                : question.type === "true-false"
                                ? "Verdadeiro/Falso"
                                : question.type === "checkbox"
                                ? "Caixas de Seleção"
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
                      {questions.reduce((sum, q) => sum + (q.points || 1), 0)}{" "}
                      pontos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duração estimada:</span>
                    <span className="text-sm font-medium">
                      {examInfo.duration} minutos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Modo:</span>
                    <span className="text-sm font-medium">
                      {examInfo.isOnline ? "Online" : "Impresso"}
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
