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
import { FileText, Plus, Database, BarChart, Clock } from "lucide-react";
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

interface ExamsDetails {
  total_exams: number;
  last_month: number;
  total_weeks: number;
  last_week: number;
  applied_last_month: number;
  total_exams_applied: number;
  recent_exams: Exam[];
  recent_questions: QuestionProps[];
  total_questions_last_month: number;
  total_questions: number;
  total_exams_generated_by_ai: number;
  total_exams_generated_by_ai_last_month: number;
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
  if (isLoading) return <Loading />;
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
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
                Questões no Banco
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
              {examsDetails?.recent_exams.map((exam, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <CardDescription>
                        Criada em:{" "}
                        {new Date(exam.created_at).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
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
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-xs break-words whitespace-normal">
                    Título
                  </TableHead>
                  <TableHead className="max-w-xs break-words whitespace-normal">
                    Criação
                  </TableHead>
                  <TableHead className="max-w-xs break-words whitespace-normal">
                    Tipo
                  </TableHead>
                  <TableHead className="max-w-xs break-words whitespace-normal">
                    Resposta Correta
                  </TableHead>
                  <TableHead className="max-w-xs break-words whitespace-normal">
                    Pontuação
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examsDetails?.recent_questions.map((question, index) => (
                  <TableRow key={index}>
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
                      {questionType[question.type]}
                    </TableCell>
                    <TableCell className="max-w-xs break-words whitespace-normal">
                      {question.type === "ES"
                        ? question.answer_text || "N/A"
                        : question.options?.[question.answer] || "N/A"}
                    </TableCell>
                    <TableCell className="max-w-xs break-words whitespace-normal">
                      {question.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
