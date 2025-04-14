"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/header";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";

type ExamStatus = "APPLIED" | "PENDING" | "CANCELLED" | "ARCHIVED";
type DifficultyLevel = "easy" | "medium" | "hard";

interface Exam {
  id: string;
  user: string;
  discipline_name: string;
  classroom_name: string;
  title: string;
  duration: number;
  score: number;
  created_at: string;
  applied_at: string | null;
  qr_code: string | null;
  description: string;
  theme: string;
  was_generated_by_ai: boolean;
  difficulty: DifficultyLevel;
  status: ExamStatus;
  discipline: string;
  classroom: string;
  questions: {
    id: string;
    title: string;
  }[];
}

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session } = useSession();

  const { data: exams, error } = useSWR<Exam[]>(
    `/exams/?user=${session?.id}`,
    fetcher
  );

  const filteredExams =
    exams?.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.discipline_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        subjectFilter === "all" || exam.discipline === subjectFilter;
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;

      return matchesSearch && matchesSubject && matchesStatus;
    }) ?? [];

  const appliedExams = filteredExams.filter(
    (exam) => exam.status === "APPLIED"
  );
  const pendingExams = filteredExams.filter(
    (exam) => exam.status === "PENDING"
  );
  const cancelledExams = filteredExams.filter(
    (exam) => exam.status === "CANCELLED"
  );
  const archivedExams = filteredExams.filter(
    (exam) => exam.status === "ARCHIVED"
  );

  const subjects = Array.from(
    new Set(exams?.map((exam) => exam.discipline) ?? [])
  );

  const renderStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case "APPLIED":
        return <Badge variant="default">Aplicada</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pendente</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline">Arquivada</Badge>;
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Minhas Provas</h1>
          <Link href="/exams/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Prova
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar provas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Disciplina</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="APPLIED">Aplicada</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="ARCHIVED">Arquivada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Todas ({filteredExams.length})
            </TabsTrigger>
            <TabsTrigger value="APPLIED">
              Aplicadas ({appliedExams.length})
            </TabsTrigger>
            <TabsTrigger value="PENDING">
              Pendentes ({pendingExams.length})
            </TabsTrigger>
            <TabsTrigger value="CANCELLED">
              Canceladas ({cancelledExams.length})
            </TabsTrigger>
            <TabsTrigger value="ARCHIVED">
              Arquivadas ({archivedExams.length})
            </TabsTrigger>
          </TabsList>

          {/* Aba "Todas" */}
          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <Card key={exam.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/exams/${exam.id}`}>
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                            </Link>
                            <Link href={`/exams/edit/${exam.id}`}>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem>Baixar</DropdownMenuItem>
                            <DropdownMenuItem>Gerar QR Code</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Arquivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="flex flex-wrap gap-2 mt-1">
                        {renderStatusBadge(exam.status)}
                        {renderDifficultyBadge(exam.difficulty)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">
                            Disciplina:
                          </span>
                          <span>{exam.discipline_name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">
                            Turma:
                          </span>
                          <span>{exam.classroom_name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">
                            Questões:
                          </span>
                          <span>
                            {exam.questions.length} ({exam.score} pontos)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">
                            Duração:
                          </span>
                          <span>{exam.duration} minutos</span>
                        </div>
                        {exam.status === "PENDING" && exam.applied_at && (
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">
                              Agendada:
                            </span>
                            <span>
                              {new Date(exam.applied_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full gap-2">
                        <Link href={`/exams/${exam.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            Ver detalhes
                          </Button>
                        </Link>
                        <Link
                          href={`/exams/edit/${exam.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full">Editar</Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">
                    Nenhuma prova encontrada
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tente ajustar seus filtros ou crie uma nova prova.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Abas para cada status */}
          {[
            { value: "APPLIED", exams: appliedExams, title: "Aplicadas" },
            { value: "PENDING", exams: pendingExams, title: "Pendentes" },
            { value: "CANCELLED", exams: cancelledExams, title: "Canceladas" },
            { value: "ARCHIVED", exams: archivedExams, title: "Arquivadas" },
          ].map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tab.exams.length > 0 ? (
                  tab.exams.map((exam) => (
                    <Card key={exam.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {exam.title}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/exams/${exam.id}`}>
                                <DropdownMenuItem>
                                  Ver detalhes
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/exams/edit/${exam.id}`}>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>Duplicar</DropdownMenuItem>
                              <DropdownMenuItem>Baixar</DropdownMenuItem>
                              <DropdownMenuItem>Gerar QR Code</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Arquivar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="flex flex-wrap gap-2 mt-1">
                          {renderDifficultyBadge(exam.difficulty)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">
                              Disciplina:
                            </span>
                            <span>{exam.discipline_name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">
                              Turma:
                            </span>
                            <span>{exam.classroom_name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">
                              Questões:
                            </span>
                            <span>
                              {exam.questions.length} ({exam.score} pontos)
                            </span>
                          </div>
                          {exam.status === "PENDING" && exam.applied_at && (
                            <div className="flex items-center">
                              <span className="w-24 text-muted-foreground">
                                Agendada:
                              </span>
                              <span>
                                {new Date(exam.applied_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full gap-2">
                          <Link href={`/exams/${exam.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              Ver detalhes
                            </Button>
                          </Link>
                          <Link
                            href={`/exams/edit/${exam.id}`}
                            className="flex-1"
                          >
                            <Button className="w-full">Editar</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      Nenhuma prova {tab.title.toLowerCase()} encontrada
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tente ajustar seus filtros ou crie uma nova prova.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
