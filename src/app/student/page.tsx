import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart, Clock, CheckCircle } from "lucide-react"

export default function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/student" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AvaliAi</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/student" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/student/exams" className="text-sm font-medium">
              Provas
            </Link>
            <Link href="/student/results" className="text-sm font-medium">
              Resultados
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Aluno</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provas Realizadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 no último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Provas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8</div>
              <p className="text-xs text-muted-foreground">+0.3 comparado ao bimestre anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">7 de 8 provas com nota acima de 6</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas Provas</TabsTrigger>
            <TabsTrigger value="recent">Provas Recentes</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 1, title: "Prova de História - 1º Ano", date: "25/03/2025", time: "10:00", duration: "60 min" },
                {
                  id: 2,
                  title: "Avaliação de Química - 3º Ano",
                  date: "28/03/2025",
                  time: "14:30",
                  duration: "90 min",
                },
                { id: 3, title: "Teste de Inglês - Turma B", date: "02/04/2025", time: "08:00", duration: "45 min" },
              ].map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>
                      Data: {exam.date} às {exam.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Duração: {exam.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/student/exam/${exam.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 4,
                  title: "Prova de Matemática - 2º Ano",
                  date: "15/03/2025",
                  score: "7.5/10",
                  status: "Aprovado",
                },
                {
                  id: 5,
                  title: "Avaliação de Física - 3º Ano",
                  date: "10/03/2025",
                  score: "8.0/10",
                  status: "Aprovado",
                },
                {
                  id: 6,
                  title: "Teste de Programação - Turma A",
                  date: "05/03/2025",
                  score: "9.5/10",
                  status: "Aprovado",
                },
              ].map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>Realizada em: {exam.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Nota: {exam.score}</span>
                      <span className="text-green-600 font-medium">{exam.status}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/student/results/${exam.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver resultado
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

