"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Download,
  QrCode,
  Clock,
  ChevronLeft,
  Star,
  FileCheck,
  Trash2,
  Archive,
  SquareX,
  Calendar,
} from "lucide-react";
import Header from "@/components/header";
import { Exam, ExamStatus, DifficultyLevel } from "@/@types/ExamProps";
import { QuestionProps } from "@/@types/QuestionProps";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { Loading } from "@/components/loading/page";
import QRCode from "react-qr-code";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

const renderStatusBadge = (status: ExamStatus | undefined) => {
  if (!status) return null;
  const examStatus = {
    Pendente: <Badge variant="outline">Pendente</Badge>,
    Aplicada: <Badge variant="default">Aplicada</Badge>,
    Cancelada: <Badge variant="destructive">Cancelada</Badge>,
    Arquivada: <Badge variant="secondary">Arquivada</Badge>,
  };
  return examStatus[status];
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

const getQuestionTypeLabel = (type: QuestionProps["type"]) => {
  switch (type) {
    case "MC":
      return "Múltipla Escolha";
    case "TF":
      return "Verdadeiro/Falso";
    case "ES":
      return "Dissertativa";
    default:
      return type;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

export default function ExamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const { toast } = useToast();

  const {
    data: exam,
    isLoading,
    mutate,
  } = useSWR<Exam>(`/exams/${examId}`, fetcher);

  const [showQrCode, setShowQrCode] = useState(false);
  const [examStatus, setExamStatus] = useState<ExamStatus | undefined>(
    exam?.status
  );

  if (isLoading || !exam) return <Loading />;

  async function handleGenerateQRCode() {
    try {
      const apiFront = process.env.NEXTAUTH_URL;
      const qr_code = `${apiFront}/exams/${examId}`;
      await api.patch(`/exams/${examId}/qrcode/`, {
        qr_code,
      });
      toast({
        duration: 10000,
        title: "QR Code gerado com sucesso",
        description: "O QR Code foi atualizado.",
        variant: "default",
      });
      if (exam) mutate({ ...exam, qr_code } as Exam, false);
    } catch (error) {
      toast({
        duration: 10000,
        title: "Erro ao gerar QR Code",
        description: "O QR Code não foi gerado.",
        variant: "destructive",
      });
    }
  }

  async function handleDownloadExam() {
    try {
      const response = await api.get(`/exams/${examId}/file/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${exam?.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({
        duration: 10000,
        title: "Prova baixada com sucesso",
        description: "A prova foi baixada como um arquivo PDF.",
        variant: "default",
      });
    } catch (error) {
      toast({
        duration: 10000,
        title: "Erro ao baixar a prova",
        description: "Não foi possível baixar a prova.",
        variant: "destructive",
      });
    }
  }

  async function handleSetExamStatus(status: "apply" | "archive" | "cancel") {
    const examStatus = {
      apply: "Aplicada",
      archive: "Arquivada",
      cancel: "Cancelada",
    };
    try {
      await api.patch(`/exams/${examId}/${status}/`);
      setExamStatus(examStatus[status] as ExamStatus);
      toast({
        duration: 10000,
        title: "Status da prova atualizado",
        description: `A prova foi marcada como ${examStatus[
          status
        ].toLowerCase()}.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        duration: 10000,
        title: "Erro ao atualizar o status da prova",
        description: "Não foi possível atualizar o status da prova.",
        variant: "destructive",
      });
    }
  }

  async function handleExameDelete() {
    try {
      const response = await api.delete(`/exams/${examId}`);
      if (response.status === 204) {
        router.push("/exams");
      }
    } catch (error: any) {
      toast({
        duration: 10000,
        title: "Erro ao excluir a prova",
        description:
          error.response?.data?.detail || "Não foi possível excluir a prova.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center">
          <Link href="/exams">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{exam.title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6 flex flex-col order-1">
            <Card className="order-1">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {renderStatusBadge(examStatus)}
                  {renderDifficultyBadge(exam.difficulty)}
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
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Disciplina:
                      </span>
                      <span className="text-sm">{exam.discipline.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Turma:
                      </span>
                      <span className="text-sm">{exam.classroom.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Tema:
                      </span>
                      <span className="text-sm">{exam.theme}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {exam.applied_at && (
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-muted-foreground">
                          Atualizada em:
                        </span>
                        <span className="text-sm">
                          {formatDate(exam.applied_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Dificuldade:
                      </span>
                      <span className="text-sm">{exam.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Status:
                      </span>
                      <span className="text-sm">{exam.status}</span>
                    </div>
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
                    onClick={handleSetExamStatus.bind(null, "archive")}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Arquivar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSetExamStatus.bind(null, "cancel")}
                  >
                    <SquareX className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleExameDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="order-2 lg:hidden">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Criação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(exam.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
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
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Pontuação</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.score} ponto(s)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="order-3 lg:hidden">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleDownloadExam}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Prova (PDF)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleGenerateQRCode}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Gerar QR Code
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleSetExamStatus.bind(null, "apply")}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Marcar como Aplicada
                </Button>
              </CardContent>
            </Card>

            <Card className="order-4">
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
                            {question.score}{" "}
                            {question.score === 1 ? "ponto" : "pontos"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center flex-col">
                      <h3 className="font-bold">Título:</h3>
                      <p className="my-2">{question.title}</p>
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {question.type === "ES" ? "Resposta:" : "Opções:"}
                      </h3>
                      {question.type === "MC" && question.options && (
                        <div className="pl-4 space-y-1 mt-2">
                          {question.options.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  question.answer === idx
                                    ? "bg-green-600 text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "TF" && question.options && (
                        <div className="pl-4 space-y-1 mt-2">
                          {question.options.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  question.answer === idx
                                    ? "bg-green-600 text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {idx === 0 ? "V" : "F"}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "ES" &&
                        (question.answer_text ? (
                          <div className="pl-4 mt-2">
                            <p className="text-sm text-muted-foreground italic">
                              {question.answer_text}
                            </p>
                          </div>
                        ) : (
                          <div className="pl-4 mt-2">
                            <p className="text-sm text-muted-foreground italic">
                              Não existe uma resposta cadastrada para essa
                              questão
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-1/3 space-y-6 hidden lg:block order-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Criação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(exam.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
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
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Pontuação</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.score} ponto(s)
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
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleDownloadExam}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Prova (PDF)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleGenerateQRCode}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Gerar QR Code
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleSetExamStatus.bind(null, "apply")}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Marcar como Aplicada
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code da Prova</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code para acessar a prova ou o gabarito.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {exam.qr_code ? (
              <QRCode value={exam.qr_code} />
            ) : (
              <div className="text-center text-muted-foreground">
                Esta prova não possui um QR code gerado.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQrCode(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
