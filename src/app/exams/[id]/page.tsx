"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Edit,
  Download,
  QrCode,
  Copy,
  Share2,
  Clock,
  Calendar,
  Users,
  BarChart,
  ChevronLeft,
  Send,
} from "lucide-react";
import Header from "@/components/header";

type ExamStatus = "draft" | "scheduled" | "active" | "completed" | "archived";
type DifficultyLevel = "easy" | "medium" | "hard";
type QuestionType = "multiple-choice" | "true-false" | "checkbox" | "essay";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: number; text: string }[];
  answer?: string;
  answers?: number[];
  points: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
  status: "pending" | "in_progress" | "completed" | "absent";
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  createdAt: string;
  updatedAt: string;
  status: ExamStatus;
  difficulty: DifficultyLevel;
  isOnline: boolean;
  duration: number;
  description: string;
  questions: Question[];
  totalPoints: number;
  responseCount?: number;
  scheduledFor?: string;
  students?: Student[];
  averageScore?: number;
  completionRate?: number;
}

export default function ExamDetailsPage() {
  const params = useParams();
  const examId = params.id as string;
  const [showQrCode, setShowQrCode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [emailList, setEmailList] = useState("");
  const [message, setMessage] = useState("");

  const exam: Exam = {
    id: examId,
    title: "Avaliação de Matemática - 2º Bimestre",
    subject: "Matemática",
    grade: "8º Ano",
    createdAt: "10/03/2025",
    updatedAt: "12/03/2025",
    status: "completed",
    difficulty: "medium",
    isOnline: true,
    duration: 60,
    description:
      "Avaliação sobre álgebra, geometria e resolução de problemas matemáticos.",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        options: [
          { id: 1, text: "x = 5" },
          { id: 2, text: "x = 10" },
          { id: 3, text: "x = 7.5" },
          { id: 4, text: "x = 5.5" },
        ],
        answer: "1",
        points: 1,
      },
      {
        id: 2,
        type: "multiple-choice",
        text: "Qual é o resultado de 3² + 4²?",
        options: [
          { id: 1, text: "7" },
          { id: 2, text: "25" },
          { id: 3, text: "49" },
          { id: 4, text: "5" },
        ],
        answer: "2",
        points: 1,
      },
      {
        id: 3,
        type: "true-false",
        text: "A soma dos ângulos internos de um triângulo é 180 graus.",
        options: [
          { id: 1, text: "Verdadeiro" },
          { id: 2, text: "Falso" },
        ],
        answer: "1",
        points: 1,
      },
      {
        id: 4,
        type: "essay",
        text: "Explique o Teorema de Pitágoras e dê um exemplo de sua aplicação.",
        points: 2,
      },
      {
        id: 5,
        type: "checkbox",
        text: "Quais das seguintes expressões resultam em números pares?",
        options: [
          { id: 1, text: "2n + 1, onde n é um número inteiro" },
          { id: 2, text: "2n, onde n é um número inteiro" },
          { id: 3, text: "n² + 1, onde n é um número ímpar" },
          { id: 4, text: "n² - 1, onde n é um número par" },
        ],
        answers: [2, 4],
        points: 2,
      },
    ],
    totalPoints: 7,
    responseCount: 28,
    scheduledFor: "15/03/2025",
    students: [
      {
        id: "1",
        name: "Ana Silva",
        email: "ana.silva@escola.edu",
        grade: "8º Ano A",
        score: 6.5,
        maxScore: 7,
        submittedAt: "15/03/2025 10:30",
        status: "completed",
      },
      {
        id: "2",
        name: "Bruno Santos",
        email: "bruno.santos@escola.edu",
        grade: "8º Ano A",
        score: 7,
        maxScore: 7,
        submittedAt: "15/03/2025 10:15",
        status: "completed",
      },
      {
        id: "3",
        name: "Carla Oliveira",
        email: "carla.oliveira@escola.edu",
        grade: "8º Ano A",
        score: 5,
        maxScore: 7,
        submittedAt: "15/03/2025 10:45",
        status: "completed",
      },
      {
        id: "4",
        name: "Daniel Pereira",
        email: "daniel.pereira@escola.edu",
        grade: "8º Ano A",
        status: "in_progress",
      },
      {
        id: "5",
        name: "Eduarda Lima",
        email: "eduarda.lima@escola.edu",
        grade: "8º Ano A",
        status: "pending",
      },
      {
        id: "6",
        name: "Felipe Costa",
        email: "felipe.costa@escola.edu",
        grade: "8º Ano A",
        status: "absent",
      },
    ],
    averageScore: 6.2,
    completionRate: 50,
  };

  const renderStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Agendada</Badge>;
      case "active":
        return <Badge variant="default">Ativa</Badge>;
      case "completed":
        return <Badge variant="default">Concluída</Badge>;
      case "archived":
        return <Badge variant="destructive">Arquivada</Badge>;
      default:
        return null;
    }
  };

  const renderDifficultyBadge = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "easy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Fácil
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Médio
          </Badge>
        );
      case "hard":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Difícil
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStudentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Em andamento</Badge>;
      case "completed":
        return <Badge variant="default">Concluído</Badge>;
      case "absent":
        return <Badge variant="destructive">Ausente</Badge>;
      default:
        return null;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case "multiple-choice":
        return "Múltipla Escolha";
      case "true-false":
        return "Verdadeiro/Falso";
      case "checkbox":
        return "Caixas de Seleção";
      case "essay":
        return "Dissertativa";
      default:
        return type;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/exams">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {renderStatusBadge(exam.status)}
                  {renderDifficultyBadge(exam.difficulty)}
                  <Badge variant="outline">
                    {exam.isOnline ? "Online" : "Impressa"}
                  </Badge>
                </div>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Disciplina:
                      </span>
                      <span className="text-sm">{exam.subject}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Turma:
                      </span>
                      <span className="text-sm">{exam.grade}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Duração:
                      </span>
                      <span className="text-sm">{exam.duration} minutos</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Pontuação total:
                      </span>
                      <span className="text-sm">{exam.totalPoints} pontos</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Criada em:
                      </span>
                      <span className="text-sm">{exam.createdAt}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Atualizada em:
                      </span>
                      <span className="text-sm">{exam.updatedAt}</span>
                    </div>
                    {exam.scheduledFor && (
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-muted-foreground">
                          Agendada para:
                        </span>
                        <span className="text-sm">{exam.scheduledFor}</span>
                      </div>
                    )}
                    {exam.responseCount && (
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-muted-foreground">
                          Respostas:
                        </span>
                        <span className="text-sm">{exam.responseCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2 w-full">
                  <Link href={`/exams/edit/${exam.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQrCode(true)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Tabs defaultValue="questions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="questions">
                  Questões ({exam.questions.length})
                </TabsTrigger>
                <TabsTrigger value="students">
                  Alunos ({exam.students?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="questions">
                <Card>
                  <CardContent className="pt-6">
                    {exam.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="mb-6 pb-6 border-b last:border-0 last:mb-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">Questão {index + 1}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">
                                {getQuestionTypeLabel(question.type)}
                              </Badge>
                              <Badge variant="outline">
                                {question.points}{" "}
                                {question.points === 1 ? "ponto" : "pontos"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="my-2">{question.text}</p>

                        {question.type === "multiple-choice" &&
                          question.options && (
                            <div className="pl-4 space-y-1 mt-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                      question.answer === option.id.toString()
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {String.fromCharCode(64 + option.id)}
                                  </span>
                                  <span>{option.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                        {question.type === "true-false" && question.options && (
                          <div className="pl-4 space-y-1 mt-2">
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                    question.answer === option.id.toString()
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {option.id === 1 ? "V" : "F"}
                                </span>
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "checkbox" && question.options && (
                          <div className="pl-4 space-y-1 mt-2">
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                                    question.answers?.includes(option.id)
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {question.answers?.includes(option.id)
                                    ? "✓"
                                    : ""}
                                </span>
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === "essay" && (
                          <div className="pl-4 mt-2">
                            <p className="text-sm text-muted-foreground italic">
                              Questão dissertativa - correção manual ou
                              assistida por IA
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2 font-medium">
                              Nome
                            </th>
                            <th className="text-left py-2 px-2 font-medium">
                              Email
                            </th>
                            <th className="text-left py-2 px-2 font-medium">
                              Turma
                            </th>
                            <th className="text-left py-2 px-2 font-medium">
                              Status
                            </th>
                            <th className="text-left py-2 px-2 font-medium">
                              Nota
                            </th>
                            <th className="text-left py-2 px-2 font-medium">
                              Enviado em
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exam.students?.map((student) => (
                            <tr
                              key={student.id}
                              className="border-b last:border-0 hover:bg-muted/50"
                            >
                              <td className="py-2 px-2">{student.name}</td>
                              <td className="py-2 px-2">{student.email}</td>
                              <td className="py-2 px-2">{student.grade}</td>
                              <td className="py-2 px-2">
                                {renderStudentStatusBadge(student.status)}
                              </td>
                              <td className="py-2 px-2">
                                {student.score !== undefined &&
                                student.maxScore !== undefined ? (
                                  <span
                                    className={
                                      student.score / student.maxScore >= 0.7
                                        ? "text-green-600"
                                        : student.score / student.maxScore >=
                                          0.5
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {student.score}/{student.maxScore}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-2">
                                {student.submittedAt || (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="statistics">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Desempenho Geral
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Nota Média</span>
                              <span className="font-medium">
                                {exam.averageScore?.toFixed(1)}/
                                {exam.totalPoints}
                              </span>
                            </div>
                            <Progress
                              value={
                                ((exam.averageScore || 0) / exam.totalPoints) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Taxa de Conclusão</span>
                              <span className="font-medium">
                                {exam.completionRate}%
                              </span>
                            </div>
                            <Progress
                              value={exam.completionRate || 0}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-muted rounded-lg p-4 text-center">
                              <div className="text-3xl font-bold text-green-600">
                                {exam.students?.filter(
                                  (s) => s.status === "completed"
                                ).length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Concluídas
                              </div>
                            </div>
                            <div className="bg-muted rounded-lg p-4 text-center">
                              <div className="text-3xl font-bold text-yellow-600">
                                {exam.students?.filter(
                                  (s) => s.status === "in_progress"
                                ).length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Em andamento
                              </div>
                            </div>
                            <div className="bg-muted rounded-lg p-4 text-center">
                              <div className="text-3xl font-bold text-blue-600">
                                {exam.students?.filter(
                                  (s) => s.status === "pending"
                                ).length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Pendentes
                              </div>
                            </div>
                            <div className="bg-muted rounded-lg p-4 text-center">
                              <div className="text-3xl font-bold text-red-600">
                                {exam.students?.filter(
                                  (s) => s.status === "absent"
                                ).length || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Ausentes
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Distribuição de Notas
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="w-16">9-10</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600"
                                style={{ width: "20%" }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">2</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16">7-8.9</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: "30%" }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">3</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16">5-6.9</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500"
                                style={{ width: "40%" }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">4</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16">3-4.9</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-400"
                                style={{ width: "10%" }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">1</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-16">0-2.9</span>
                            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-600"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                            <span className="w-8 text-right">0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Duração</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.duration} minutos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Data da Prova</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.scheduledFor || "Não agendada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Alunos</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.students?.length || 0} alunos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Nota Média</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.averageScore?.toFixed(1) || "-"}/
                        {exam.totalPoints}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Resultados (CSV)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Prova (PDF)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  Gerar QR Code
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Prova
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog para QR Code */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code da Prova</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code para acessar a prova ou o gabarito.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="w-64 h-64 bg-muted flex items-center justify-center">
              <QrCode className="h-32 w-32 text-primary" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrCode(false)}>Fechar</Button>
            <Button variant="outline">Baixar QR Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Compartilhar */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Prova</DialogTitle>
            <DialogDescription>
              Envie a prova para os alunos por email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Emails dos alunos</Label>
              <Textarea
                id="emails"
                placeholder="Digite os emails separados por vírgula ou linha"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: aluno1@escola.edu, aluno2@escola.edu
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Digite uma mensagem para os alunos"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)} variant="outline">
              Cancelar
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
