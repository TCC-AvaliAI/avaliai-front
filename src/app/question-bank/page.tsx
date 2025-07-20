"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
} from "lucide-react";
import Header from "@/components/header";
import { QuestionProps } from "@/@types/QuestionProps";
import useSWR from "swr";
import { Loading } from "@/components/loading/page";
import { fetcher } from "@/lib/fetcher";
import api from "@/lib/axios";
import { MessageAlertProps } from "@/components/message-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttachQuestionModal } from "@/components/attach-question-modal";
import { Badge } from "@/components/ui/badge";
import { ExamsPageProps } from "../exams/page";
import { NotFoundItems } from "@/components/not-found-items";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { QuestionDetailsModal } from "@/components/question-detail-modal";
import { useToast } from "@/components/ui/use-toast";

interface QuestionsPageProps {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionProps[];
}

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [typeQuestion, setTypeQuestion] = useState("");
  const [questionsData, setQuestionsData] = useState<QuestionsPageProps | null>(
    null
  );
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionProps | null>(null);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedQuestionDetails, setSelectedQuestionDetails] =
    useState<QuestionProps | null>(null);
  const { toast } = useToast();
  const { data: exams } = useSWR<ExamsPageProps>(`/exams/`, fetcher);

  const handleOpenDetailsModal = (question: QuestionProps) => {
    setSelectedQuestionDetails(question);
    setIsDetailsModalOpen(true);
  };

  const fetchQuestions = async (page: number, search: string, type: string) => {
    setIsLoading(true);
    try {
      const response = await api.get("/questions/", {
        params: {
          page,
          search,
          type: type === "ALL" ? "" : type,
        },
      });
      setQuestionsData(response.data);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchQuestions(1, searchTerm, typeQuestion);
  };

  const handleOpenAttachModal = (question: QuestionProps) => {
    setSelectedQuestion(question);
    setIsAttachModalOpen(true);
  };

  const handleAttachSuccess = () => {
    toast({
      duration: 10000,
      title: "Questão anexada com sucesso!",
      description: "A questão foi adicionada à prova.",
      variant: "default",
    });
  };

  const handleAttachError = () => {
    toast({
      duration: 10000,
      title: "Erro ao anexar questão",
      description:
        "Não foi possível anexar a questão à prova. Tente novamente.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    fetchQuestions(currentPage, searchTerm, typeQuestion);
  }, [currentPage]);

  if (isLoading) return <Loading />;

  const questionType = {
    MC: "Múltipla Escolha",
    TF: "Verdadeiro ou Falso",
    ES: "Discursiva",
    ALL: "Todos",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Banco de Questões
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-4">
            <div className="relative w-full max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por título da questão"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-md"
              />
            </div>
            <div className="flex flex-row w-full sm:w-auto gap-2">
              <div className="flex-1 min-w-[150px]">
                <Select value={typeQuestion} onValueChange={setTypeQuestion}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center truncate">
                      <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {typeQuestion
                          ? questionType[
                              typeQuestion as keyof typeof questionType
                            ]
                          : "Tipo da questão"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="MC">Múltipla Escolha</SelectItem>
                    <SelectItem value="TF">Verdadeiro ou Falso</SelectItem>
                    <SelectItem value="ES">Discursiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={handleSearch}
                className="flex-shrink-0"
              >
                Buscar
              </Button>
            </div>
          </div>

          {questionsData?.results && questionsData.results.length ? (
            <>
              <div className="overflow-x-auto w-full">
                <Table className="overflow-hidden min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="max-w-[150px] truncate text-base">
                        Autor
                      </TableHead>
                      <TableHead className="max-w-[200px] truncate text-base">
                        Título
                      </TableHead>
                      <TableHead className="max-w-[100px] truncate text-base">
                        Criação
                      </TableHead>
                      <TableHead className="max-w-[100px] truncate text-base">
                        Tipo
                      </TableHead>
                      <TableHead className="max-w-[100px] truncate text-base">
                        Criado por
                      </TableHead>
                      <TableHead className="max-w-[200px] truncate text-base">
                        Resposta Correta
                      </TableHead>
                      <TableHead className="max-w-[150px] truncate text-base">
                        Tags
                      </TableHead>
                      <TableHead className="max-w-[100px] truncate text-base">
                        Anexar à prova
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionsData.results.map((question) => (
                      <TableRow key={question.id} className="h-16">
                        <TableCell className="max-w-[150px] truncate">
                          {question.author_name}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <span className="truncate flex-1 block">
                            {question.title}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {new Date(question.created_at!).toLocaleDateString(
                            "pt-BR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {
                            questionType[
                              question.type as keyof typeof questionType
                            ]
                          }
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate">
                          {question.was_generated_by_ai ? "IA" : "Você"}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex items-center">
                            <span className="truncate flex-1">
                              {question.type === "ES"
                                ? question.answer_text || "N/A"
                                : question.options?.[question.answer] || "N/A"}
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className="ml-2 px-2"
                              onClick={() => handleOpenDetailsModal(question)}
                            >
                              Ver mais
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          <div className="flex flex-col gap-1">
                            {question.tags.length > 0 ? (
                              question.tags.map((tag) => (
                                <Badge
                                  variant="secondary"
                                  key={tag.name}
                                  className="truncate max-w-full"
                                >
                                  {tag.name}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary">N/A</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[100px]">
                          <Button
                            variant="outline"
                            onClick={() => handleOpenAttachModal(question)}
                          >
                            <PlusCircle className="h-4 w-4" />
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
                  disabled={!questionsData.previous}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">
                  Página {currentPage}
                </span>
                <Button
                  variant="outline"
                  disabled={!questionsData.next}
                  onClick={() => setCurrentPage(currentPage + 1)}
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
      </main>
      {selectedQuestion && (
        <AttachQuestionModal
          question={selectedQuestion}
          exams={exams}
          isOpen={isAttachModalOpen}
          onClose={() => {
            setIsAttachModalOpen(false);
            setSelectedQuestion(null);
          }}
          onError={handleAttachError}
          onSuccess={handleAttachSuccess}
        />
      )}
    </div>
  );
}
