"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Calendar, Clock, Users, Filter, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Definição dos tipos
type ExamStatus = "draft" | "scheduled" | "active" | "completed" | "archived";
type DifficultyLevel = "easy" | "medium" | "hard";

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
  questionCount: number;
  totalPoints: number;
  responseCount?: number;
  scheduledFor?: string;
}

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dados simulados de exames
  const exams: Exam[] = [
    {
      id: "1",
      title: "Avaliação de Matemática - 2º Bimestre",
      subject: "Matemática",
      grade: "8º Ano",
      createdAt: "10/03/2025",
      updatedAt: "12/03/2025",
      status: "completed",
      difficulty: "medium",
      isOnline: true,
      duration: 60,
      questionCount: 10,
      totalPoints: 10,
      responseCount: 28
    },
    {
      id: "2",
      title: "Prova de Física - Leis de Newton",
      subject: "Física",
      grade: "1º Ano - EM",
      createdAt: "05/03/2025",
      updatedAt: "05/03/2025",
      status: "scheduled",
      difficulty: "hard",
      isOnline: true,
      duration: 90,
      questionCount: 15,
      totalPoints: 20,
      scheduledFor: "25/03/2025"
    },
    {
      id: "3",
      title: "Avaliação de História - Brasil Colônia",
      subject: "História",
      grade: "7º Ano",
      createdAt: "01/03/2025",
      updatedAt: "02/03/2025",
      status: "draft",
      difficulty: "medium",
      isOnline: false,
      duration: 45,
      questionCount: 8,
      totalPoints: 10
    },
    {
      id: "4",
      title: "Teste de Inglês - Verbos Irregulares",
      subject: "Inglês",
      grade: "9º Ano",
      createdAt: "28/02/2025",
      updatedAt: "01/03/2025",
      status: "active",
      difficulty: "medium",
      isOnline: true,
      duration: 30,
      questionCount: 20,
      totalPoints: 20,
      responseCount: 12
    },
    {
      id: "5",
      title: "Avaliação de Química - Tabela Periódica",
      subject: "Química",
      grade: "2º Ano - EM",
      createdAt: "20/02/2025",
      updatedAt: "22/02/2025",
      status: "archived",
      difficulty: "hard",
      isOnline: false,
      duration: 60,
      questionCount: 12,
      totalPoints: 15,
      responseCount: 32
    },
    {
      id: "6",
      title: "Prova de Biologia - Ecologia",
      subject: "Biologia",
      grade: "3º Ano - EM",
      createdAt: "15/02/2025",
      updatedAt: "16/02/2025",
      status: "completed",
      difficulty: "medium",
      isOnline: true,
      duration: 75,
      questionCount: 15,
      totalPoints: 15,
      responseCount: 30
    }
  ];

  // Filtrar exames com base nos critérios de busca e filtros
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || exam.subject === subjectFilter;
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Agrupar exames por status para as abas
  const draftExams = filteredExams.filter(exam => exam.status === "draft");
  const scheduledExams = filteredExams.filter(exam => exam.status === "scheduled");
  const activeExams = filteredExams.filter(exam => exam.status === "active");
  const completedExams = filteredExams.filter(exam => exam.status === "completed");
  const archivedExams = filteredExams.filter(exam => exam.status === "archived");

  // Extrair disciplinas únicas para o filtro
  const subjects = Array.from(new Set(exams.map(exam => exam.subject)));

  // Função para renderizar o badge de status
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

  // Função para renderizar o badge de dificuldade
  const renderDifficultyBadge = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fácil</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Médio</Badge>;
      case "hard":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Difícil</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AvaliAi</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/exams" className="text-sm font-medium text-primary">
              Provas
            </Link>
            <Link href="/question-bank" className="text-sm font-medium">
              Banco de Questões
            </Link>
            <Link href="/reports" className="text-sm font-medium">
              Relatórios
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Perfil
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>
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
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
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
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="scheduled">Agendada</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="archived">Arquivada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas ({filteredExams.length})</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos ({draftExams.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Agendadas ({scheduledExams.length})</TabsTrigger>
            <TabsTrigger value="active">Ativas ({activeExams.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídas ({completedExams.length})</TabsTrigger>
            <TabsTrigger value="archived">Arquivadas ({archivedExams.length})</TabsTrigger>
          </TabsList>
          
          {/* Aba "Todas" */}
          <TabsContent value="all">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.length > 0 ? (
                filteredExams.map(exam => (
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
                            <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="flex flex-wrap gap-2 mt-1">
                        {renderStatusBadge(exam.status)}
                        {renderDifficultyBadge(exam.difficulty)}
                        <Badge variant="outline">{exam.isOnline ? "Online" : "Impressa"}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">Disciplina:</span>
                          <span>{exam.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">Turma:</span>
                          <span>{exam.grade}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">Questões:</span>
                          <span>{exam.questionCount} ({exam.totalPoints} pontos)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-muted-foreground">Duração:</span>
                          <span>{exam.duration} minutos</span>
                        </div>
                        {exam.status === "scheduled" && exam.scheduledFor && (
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">Agendada:</span>
                            <span>{exam.scheduledFor}</span>
                          </div>
                        )}
                        {(exam.status === "completed" || exam.status === "active") && exam.responseCount && (
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">Respostas:</span>
                            <span>{exam.responseCount}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full gap-2">
                        <Link href={`/exams/${exam.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">Ver detalhes</Button>
                        </Link>
                        <Link href={`/exams/edit/${exam.id}`} className="flex-1">
                          <Button className="w-full">Editar</Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">Nenhuma prova encontrada</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tente ajustar seus filtros ou crie uma nova prova.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Abas para cada status */}
          {[
            { value: "draft", exams: draftExams, title: "Rascunhos" },
            { value: "scheduled", exams: scheduledExams, title: "Agendadas" },
            { value: "active", exams: activeExams, title: "Ativas" },
            { value: "completed", exams: completedExams, title: "Concluídas" },
            { value: "archived", exams: archivedExams, title: "Arquivadas" }
          ].map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tab.exams.length > 0 ? (
                  tab.exams.map(exam => (
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
                              <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="flex flex-wrap gap-2 mt-1">
                          {renderDifficultyBadge(exam.difficulty)}
                          <Badge variant="outline">{exam.isOnline ? "Online" : "Impressa"}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">Disciplina:</span>
                            <span>{exam.subject}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">Turma:</span>
                            <span>{exam.grade}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-muted-foreground">Questões:</span>
                            <span>{exam.questionCount} ({exam.totalPoints} pontos)</span>
                          </div>
                          {exam.status === "scheduled" && exam.scheduledFor && (
                            <div className="flex items-center">
                              <span className="w-24 text-muted-foreground">Agendada:</span>
                              <span>{exam.scheduledFor}</span>
                            </div>
                          )}
                          {(exam.status === "completed" || exam.status === "active") && exam.responseCount && (
                            <div className="flex items-center">
                              <span className="w-24 text-muted-foreground">Respostas:</span>
                              <span>{exam.responseCount}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full gap-2">
                          <Link href={`/exams/${exam.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">Ver detalhes</Button>
                          </Link>
                          <Link href={`/exams/edit/${exam.id}`} className="flex-1">
                            <Button className="w-full">Editar</Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Nenhuma prova {tab.title.toLowerCase()} encontrada</h3>
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
