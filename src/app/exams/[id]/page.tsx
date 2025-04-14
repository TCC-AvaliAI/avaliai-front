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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Download,
  QrCode,
  Share2,
  Clock,
  ChevronLeft,
  Send,
} from "lucide-react";
import Header from "@/components/header";
import { Exam, ExamStatus, DifficultyLevel } from "@/@types/ExamProps";
import { QuestionProps } from "@/@types/QuestionProps";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

const renderStatusBadge = (status: ExamStatus) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline">Pendente</Badge>;
    case "APPLIED":
      return <Badge variant="default">Aplicada</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelada</Badge>;
    case "ARCHIVED":
      return <Badge variant="secondary">Arquivada</Badge>;
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
  const params = useParams();
  const examId = params.id as string;
  const [showQrCode, setShowQrCode] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [emailList, setEmailList] = useState("");
  const [message, setMessage] = useState("");

  const { data: exam, error } = useSWR<Exam>(`/exams/${examId}`, fetcher);

  if (!exam) {
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
          </div>
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Carregando detalhes da prova...
            </p>
          </Card>
        </main>
      </div>
    );
  }

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
                    {exam.qr_code ? "Online" : "Impressa"}
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
                      <span className="text-sm">{exam.discipline}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Turma:
                      </span>
                      <span className="text-sm">{exam.classroom}</span>
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
                      <span className="text-sm">{exam.score} pontos</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-32 text-sm text-muted-foreground">
                        Criada em:
                      </span>
                      <span className="text-sm">
                        {formatDate(exam.created_at)}
                      </span>
                    </div>
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
                    {exam.applied_at && (
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-muted-foreground">
                          Agendada para:
                        </span>
                        <span className="text-sm">
                          {formatDate(exam.applied_at)}
                        </span>
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
                <TabsTrigger value="statistics">Resultados</TabsTrigger>
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
                                {question.score}{" "}
                                {question.score === 1 ? "ponto" : "pontos"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="my-2">{question.title}</p>

                        {question.type === "MC" && question.options && (
                          <div className="pl-4 space-y-1 mt-2">
                            {question.options.map((option, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                    question.answer === idx
                                      ? "bg-primary text-primary-foreground"
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
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                    question.answer === idx
                                      ? "bg-primary text-primary-foreground"
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

                        {question.type === "ES" && (
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
            {exam.qr_code ? (
              <div className="w-64 h-64 bg-muted flex items-center justify-center">
                <img
                  src={exam.qr_code}
                  alt="QR Code da prova"
                  className="w-full h-full object-contain"
                />
              </div>
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
