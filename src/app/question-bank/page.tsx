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
import { Exam } from "@/@types/ExamProps";
import { AttachQuestionModal } from "@/components/attach-question-modal";
import { Badge } from "@/components/ui/badge";
import { ExamsPageProps } from "../exams/page";
import { NotFoundItems } from "@/components/not-found-items";

interface QuestionsPageProps {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionProps[];
}

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionProps | null>(null);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const questionType = {
    MC: "Múltipla Escolha",
    TF: "Verdadeiro ou Falso",
    ES: "Discursiva",
  };
  const { data: exams } = useSWR<ExamsPageProps>(`/exams/`, fetcher);
  const {
    data: questions,
    isLoading,
    mutate,
  } = useSWR<QuestionsPageProps>(`/questions/?page=${currentPage}`, fetcher);

  const handleSearch = async () => {
    const response = await api.get(`/questions/`, {
      params: {
        search: searchTerm,
        page: currentPage,
      },
    });
    const searchResults = response.data as QuestionsPageProps;
    mutate(searchResults, false);
  };

  const handleDeleteQuestion = async (id: string | undefined) => {
    try {
      await api.delete(`/questions/${id}`);
      setMessageAlert({
        message: "Questão excluída com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao excluir a questão.",
        variant: "error",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenAttachModal = (question: QuestionProps) => {
    setSelectedQuestion(question);
    setIsAttachModalOpen(true);
  };

  const handleAttachSuccess = () => {
    setMessageAlert({
      message: "Questão anexada com sucesso!",
      variant: "success",
    });
  };

  const handleAttachError = () => {
    setMessageAlert({
      message: "Erro ao anexar questão.",
      variant: "error",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col">
      <Header message={messageAlert} setMessage={setMessageAlert} />
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              Banco de Questões
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por título, autor, resposta ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-md"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Buscar
            </Button>
          </div>

          {questions?.results && questions.results.length ? (
            <>
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="max-w-xs break-words whitespace-normal text-base">
                      Autor
                    </TableHead>
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
                      Criado por
                    </TableHead>
                    <TableHead className="max-w-xs break-words whitespace-normal text-base">
                      Resposta Correta
                    </TableHead>
                    <TableHead className="max-w-xs break-words whitespace-normal text-base">
                      Tags
                    </TableHead>
                    <TableHead className="max-w-xs break-words whitespace-normal text-base">
                      Ação
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.results.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {question.author_name}
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {question.title}
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {new Date(question.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {
                          questionType[
                            question.type as keyof typeof questionType
                          ]
                        }
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {question.was_generated_by_ai ? "IA" : "Você"}
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        {question.type === "ES"
                          ? question.answer_text || "N/A"
                          : question.options?.[question.answer] || "N/A"}
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        <div className="flex flex-col gap-1">
                          {question.tags.length > 0 ? (
                            question.tags.map((tag) => (
                              <Badge variant="secondary" key={tag.name}>
                                {tag.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary">N/A</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs break-words whitespace-normal">
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleDeleteQuestion(question.id as string)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleOpenAttachModal(question)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center items-center mt-4 space-x-4">
                <Button
                  variant="outline"
                  disabled={!questions.previous}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">
                  Página {currentPage}
                </span>
                <Button
                  variant="outline"
                  disabled={!questions.next}
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
