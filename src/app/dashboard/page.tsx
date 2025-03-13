import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Database, BarChart, Clock } from "lucide-react"

export default function DashboardPage() {
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
            <Link href="/exams" className="text-sm font-medium">
              Provas
            </Link>
            <Link href="/question-bank" className="text-sm font-medium">
              Banco de Questões
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
              <CardTitle className="text-sm font-medium">Total de Provas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 no último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provas Aplicadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+1 na última semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questões no Banco</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">+15 no último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Notas</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.6</div>
              <p className="text-xs text-muted-foreground">+0.2 comparado ao mês anterior</p>
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
              {[
                { title: "Prova de Matemática - 2º Ano", date: "15/03/2025", status: "Aplicada", responses: 28 },
                { title: "Avaliação de Física - 3º Ano", date: "10/03/2025", status: "Corrigida", responses: 32 },
                { title: "Teste de Programação - Turma A", date: "05/03/2025", status: "Corrigida", responses: 24 },
              ].map((exam, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>Aplicada em: {exam.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Status: {exam.status}</span>
                      <span>Respostas: {exam.responses}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/exams/${index}`} className="w-full">
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
              {[
                { title: "Prova de História - 1º Ano", date: "25/03/2025", mode: "Online", students: 35 },
                { title: "Avaliação de Química - 3º Ano", date: "28/03/2025", mode: "Impressa", students: 30 },
                { title: "Teste de Inglês - Turma B", date: "02/04/2025", mode: "Online", students: 28 },
              ].map((exam, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>Data: {exam.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Modo: {exam.mode}</span>
                      <span>Alunos: {exam.students}</span>
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
  )
}

