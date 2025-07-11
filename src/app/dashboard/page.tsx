"use client";

import Link from "next/link";
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
import {
  FileText,
  Plus,
  Database,
  BarChart,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Search,
} from "lucide-react";
import Header from "@/components/header";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Exam } from "@/@types/ExamProps";
import { QuestionProps } from "@/@types/QuestionProps";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loading } from "@/components/loading/page";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import api from "@/lib/axios";
import { MessageAlert, MessageAlertProps } from "@/components/message-alert";
import { set } from "date-fns";
import { Input } from "@/components/ui/input";
import { NotFoundItems } from "@/components/not-found-items";
import { QuestionDetailsModal } from "@/components/question-detail-modal";

interface ExamsDetails {
  total_exams: number;
  last_month: number;
  total_weeks: number;
  last_week: number;
  applied_last_month: number;
  total_exams_applied: number;
  recent_exams: Exam[];
  total_questions_last_month: number;
  total_questions: number;
  total_exams_generated_by_ai: number;
  total_exams_generated_by_ai_last_month: number;
}

interface RecentQuestionsProps {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionProps[];
}

export default function DashboardPage() {
  const questionType = {
    MC: "Múltipla Escolha",
    TF: "Verdadeiro ou Falso",
    ES: "Discursiva",
  };
  const { data: examsDetails, isLoading } = useSWR<ExamsDetails>(
    `/exams/details/`,
    fetcher
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedQuestionDetails, setSelectedQuestionDetails] =
    useState<QuestionProps | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    data: recent_questions,
    isLoading: isQuestionLoading,
    mutate: mutateQuestions,
  } = useSWR<RecentQuestionsProps>(
    `/questions/recents/?page=${currentPage}`,
    fetcher
  );

  const handleSearch = async () => {
    try {
      const response = await api.get(`/questions/`, {
        params: {
          search: searchTerm,
          page: currentPage,
        },
      });
      const searchResults = response.data as RecentQuestionsProps;
      mutateQuestions(searchResults, false);
    } catch (error) {
      setMessageAlert({
        message: "Não encontramos questões com esse termo",
        variant: "error",
      });
      setCurrentPage(1);
    }
  };

  async function handleDeleteQuestion(id: string) {
    try {
      await api.delete(`/questions/${id}`);
      await mutateQuestions(
        {
          ...recent_questions,
          results: recent_questions?.results.filter(
            (question) => question.id !== id
          ),
        } as unknown as RecentQuestionsProps,
        false
      );
      setMessageAlert({
        message: "Questão deletada com sucesso",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao deletar a questão",
        variant: "error",
      });
    }
  }

  const handleOpenDetailsModal = (question: QuestionProps) => {
    setSelectedQuestionDetails(question);
    setIsDetailsModalOpen(true);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header message={messageAlert} setMessage={setMessageAlert} />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/exams/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Prova
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Provas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsDetails?.total_exams}
              </div>
              <p className="text-xs text-muted-foreground">
                +{examsDetails?.last_month} no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Provas Aplicadas
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsDetails?.total_exams_applied}
              </div>
              <p className="text-xs text-muted-foreground">
                +{examsDetails?.applied_last_month} no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Questões
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsDetails?.total_questions}
              </div>
              <p className="text-xs text-muted-foreground">
                +{examsDetails?.total_questions_last_month} no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Provas geradas pela IA
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {examsDetails?.total_exams_generated_by_ai}
              </div>
              <p className="text-xs text-muted-foreground">
                +{examsDetails?.total_exams_generated_by_ai_last_month} no
                último mês
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Provas Recentes</TabsTrigger>
            <TabsTrigger value="upcoming">Questões Recentes</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {examsDetails?.recent_exams.length ? (
                examsDetails?.recent_exams.map((exam, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        <CardDescription>
                          Criada em:{" "}
                          {new Date(exam.created_at).toLocaleDateString(
                            "pt-BR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        title={
                          exam.was_generated_by_ai
                            ? "Criada por IA"
                            : "Criada por você"
                        }
                        className="hover:cursor-help"
                      >
                        {exam.was_generated_by_ai ? "IA" : "Você"}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <span>Status: {exam.status}</span>
                        <span>Dificuldade: {exam.difficulty}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/exams/${exam.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Ver detalhes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <NotFoundItems
                  message="Nenhuma prova encontrada"
                  description="Tente ajustar seus filtros ou criar uma nova prova."
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            {isQuestionLoading ? (
              <Loading />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[180px] max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por título da questão"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 flex-1"
                    />
                  </div>
                  <Button variant="outline" onClick={handleSearch}>
                    Buscar
                  </Button>
                </div>
                {recent_questions?.results.length ? (
                  <>
                    <div className="overflow-x-auto w-full">
                      <Table className="overflow-hidden min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="max-w-xs break-words whitespace-normal text-base">
                              Título
                            </TableHead>
                            <TableHead className="max-w-xs break-words whitespace-normal text-base">
                              Criação
                            </TableHead>
                            <TableHead className="max-w-xs break-words whitespace-normal text-base">
                              Tipo
                            </TableHead>
                            <TableHead className="max-w-xs break-words whitespace-normal text-base">
                              Resposta Correta
                            </TableHead>
                            <TableHead className="max-w-xs break-words whitespace-normal text-base">
                              Ação
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recent_questions.results.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell className="truncate flex-1 block">
                                {question.title}
                              </TableCell>
                              <TableCell className="max-w-xs break-words whitespace-normal">
                                {new Date(
                                  question.created_at!
                                ).toLocaleDateString("pt-BR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })}
                              </TableCell>
                              <TableCell className="max-w-xs break-words whitespace-normal">
                                {
                                  questionType[
                                    question.type as keyof typeof questionType
                                  ]
                                }
                              </TableCell>
                              <TableCell className="max-w-[200px]">
                                <div className="flex items-center">
                                  <span className="truncate flex-1">
                                    {question.type === "ES"
                                      ? question.answer_text || "N/A"
                                      : question.options?.[question.answer] ||
                                        "N/A"}
                                  </span>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="ml-2 px-2"
                                    onClick={() =>
                                      handleOpenDetailsModal(question)
                                    }
                                  >
                                    Ver mais
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs break-words whitespace-normal">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteQuestion(question.id as string)
                                  }
                                >
                                  <Trash2 />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <QuestionDetailsModal
                          question={selectedQuestionDetails}
                          isOpen={isDetailsModalOpen}
                          onClose={() => setIsDetailsModalOpen(false)}
                        />
                      </Table>
                    </div>
                    <div className="flex justify-center items-center mt-4 space-x-4">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="text-sm font-medium">
                        Página {currentPage}
                      </span>
                      <Button
                        variant="outline"
                        disabled={!recent_questions?.next}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <NotFoundItems
                    message="Nenhuma questão encontrada"
                    description="Tente ajustar seus filtros ou criar uma nova prova."
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
