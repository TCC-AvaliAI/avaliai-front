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
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { Exam } from "@/@types/ExamProps";

interface ExamsDetails {
  total_exams: number;
  last_month: number;
  total_weeks: number;
  last_week: number;
  applied_last_month: number;
  total_exams_applied: number;
  recent_exams: Exam[];
  next_exams_applications: Exam[];
  total_questions_last_month: number;
  total_questions: number;
  total_exams_generated_by_ai: number;
  total_exams_generated_by_ai_last_month: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: examsDetails, isLoading } = useSWR<ExamsDetails>(
    session?.id ? `/exams/details/` : null,
    fetcher
  );

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
                +{examsDetails?.total_exams_generated_by_ai_last_month} no último
                mês
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Provas Recentes</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas Aplicações</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {examsDetails?.recent_exams.map((exam, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>
                      Criada em:{" "}
                      {new Date(exam.created_at).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </CardDescription>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {examsDetails?.next_exams_applications.map((exam, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>
                      Criação:{" "}
                      {new Date(exam.created_at).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Status: {exam.status}</span>
                      <span>Dificuldade: {exam.difficulty}</span>
                      <span>Disciplina: {exam.discipline}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/exams/${index + 3}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
