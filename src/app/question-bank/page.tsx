"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Database, FileText, Plus, Search, Edit, Trash2 } from "lucide-react";

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    answer: "",
    subject: "",
    grade: "",
    difficulty: "medium",
  });

  // Sample data for demonstration
  const questions = [
    {
      id: 1,
      text: "Qual é a capital do Brasil?",
      type: "multiple-choice",
      subject: "Geografia",
      grade: "6º Ano",
      difficulty: "easy",
      options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
      answer: "2",
    },
    {
      id: 2,
      text: "Qual é o resultado de 7 × 8?",
      type: "multiple-choice",
      subject: "Matemática",
      grade: "5º Ano",
      difficulty: "easy",
      options: ["54", "56", "58", "62"],
      answer: "1",
    },
    {
      id: 3,
      text: "A água ferve a 100°C ao nível do mar.",
      type: "true-false",
      subject: "Ciências",
      grade: "7º Ano",
      difficulty: "medium",
      options: ["Verdadeiro", "Falso"],
      answer: "0",
    },
    {
      id: 4,
      text: "Explique o processo de fotossíntese e sua importância para os seres vivos.",
      type: "essay",
      subject: "Biologia",
      grade: "1º Ano - EM",
      difficulty: "hard",
    },
    {
      id: 5,
      text: "Quais dos seguintes são planetas do Sistema Solar?",
      type: "checkbox",
      subject: "Ciências",
      grade: "8º Ano",
      difficulty: "medium",
      options: ["Terra", "Lua", "Marte", "Sol"],
      answers: [0, 2],
    },
    {
      id: 6,
      text: "Resolva a equação: 2x + 5 = 15",
      type: "multiple-choice",
      subject: "Matemática",
      grade: "8º Ano",
      difficulty: "medium",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
      answer: "0",
    },
  ];

  const filteredQuestions = questions.filter((q) => {
    return (
      (searchTerm === "" ||
        q.text.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (subject === "" || q.subject === subject) &&
      (grade === "" || q.grade === grade) &&
      (difficulty === "" || q.difficulty === difficulty)
    );
  });

  const handleNewQuestionChange = (field: any, value: any) => {
    setNewQuestion({
      ...newQuestion,
      [field]: value,
    });
  };

  const handleOptionChange = (index: any, value: any) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSubject("");
    setGrade("");
    setDifficulty("");
  };

  const getQuestionTypeLabel = (type: any) => {
    switch (type) {
      case "multiple-choice":
        return "Múltipla Escolha";
      case "true-false":
        return "Verdadeiro/Falso";
      case "checkbox":
        return "Caixas de Seleção";
      case "essay":
        return "Dissertativa";
      default:
        return type;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
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
            <Link
              href="/question-bank"
              className="text-sm font-medium text-primary"
            >
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
          <h1 className="text-3xl font-bold tracking-tight">
            Banco de Questões
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Questão
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Questão</DialogTitle>
                <DialogDescription>
                  Crie uma nova questão para adicionar ao banco de questões.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-type" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={newQuestion.type}
                    onValueChange={(value) =>
                      handleNewQuestionChange("type", value)
                    }
                  >
                    <SelectTrigger id="question-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">
                        Múltipla Escolha
                      </SelectItem>
                      <SelectItem value="true-false">
                        Verdadeiro/Falso
                      </SelectItem>
                      <SelectItem value="checkbox">
                        Caixas de Seleção
                      </SelectItem>
                      <SelectItem value="essay">Dissertativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-text" className="text-right">
                    Pergunta
                  </Label>
                  <Textarea
                    id="question-text"
                    value={newQuestion.text}
                    onChange={(e) =>
                      handleNewQuestionChange("text", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="Digite a pergunta aqui..."
                  />
                </div>

                {newQuestion.type === "multiple-choice" && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Opções</Label>
                    <div className="col-span-3 space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroup
                            value={newQuestion.answer}
                            onValueChange={(value) =>
                              handleNewQuestionChange("answer", value)
                            }
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                            />
                          </RadioGroup>
                          <Input
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Opção ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-subject" className="text-right">
                    Disciplina
                  </Label>
                  <Input
                    id="question-subject"
                    value={newQuestion.subject}
                    onChange={(e) =>
                      handleNewQuestionChange("subject", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="Ex: Matemática"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-grade" className="text-right">
                    Série
                  </Label>
                  <Input
                    id="question-grade"
                    value={newQuestion.grade}
                    onChange={(e) =>
                      handleNewQuestionChange("grade", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="Ex: 8º Ano"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-difficulty" className="text-right">
                    Dificuldade
                  </Label>
                  <Select
                    value={newQuestion.difficulty}
                    onValueChange={(value) =>
                      handleNewQuestionChange("difficulty", value)
                    }
                  >
                    <SelectTrigger id="question-difficulty">
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Questão</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar questões..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Matemática">Matemática</SelectItem>
                  <SelectItem value="Português">Português</SelectItem>
                  <SelectItem value="Ciências">Ciências</SelectItem>
                  <SelectItem value="Geografia">Geografia</SelectItem>
                  <SelectItem value="História">História</SelectItem>
                  <SelectItem value="Biologia">Biologia</SelectItem>
                  <SelectItem value="Física">Física</SelectItem>
                  <SelectItem value="Química">Química</SelectItem>
                </SelectContent>
              </Select>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Série" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="5º Ano">5º Ano</SelectItem>
                  <SelectItem value="6º Ano">6º Ano</SelectItem>
                  <SelectItem value="7º Ano">7º Ano</SelectItem>
                  <SelectItem value="8º Ano">8º Ano</SelectItem>
                  <SelectItem value="9º Ano">9º Ano</SelectItem>
                  <SelectItem value="1º Ano - EM">1º Ano - EM</SelectItem>
                  <SelectItem value="2º Ano - EM">2º Ano - EM</SelectItem>
                  <SelectItem value="3º Ano - EM">3º Ano - EM</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="mt-2"
            >
              Limpar filtros
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas as Questões</TabsTrigger>
            <TabsTrigger value="multiple-choice">Múltipla Escolha</TabsTrigger>
            <TabsTrigger value="true-false">Verdadeiro/Falso</TabsTrigger>
            <TabsTrigger value="checkbox">Caixas de Seleção</TabsTrigger>
            <TabsTrigger value="essay">Dissertativas</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {question.subject}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {question.grade}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            question.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : question.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.difficulty === "easy"
                            ? "Fácil"
                            : question.difficulty === "medium"
                            ? "Médio"
                            : "Difícil"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-medium mb-2">{question.text}</p>
                    {question.options && (
                      <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                question.answer === index.toString() ||
                                (question.answers &&
                                  question.answers.includes(index))
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">
                  Nenhuma questão encontrada
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar seus filtros ou adicione novas questões ao
                  banco.
                </p>
              </div>
            )}
          </TabsContent>

          {["multiple-choice", "true-false", "checkbox", "essay"].map(
            (type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {filteredQuestions.filter((q) => q.type === type).length > 0 ? (
                  filteredQuestions
                    .filter((q) => q.type === type)
                    .map((question) => (
                      <Card key={question.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                {question.subject}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                {question.grade}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  question.difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : question.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {question.difficulty === "easy"
                                  ? "Fácil"
                                  : question.difficulty === "medium"
                                  ? "Médio"
                                  : "Difícil"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="font-medium mb-2">{question.text}</p>
                          {question.options && (
                            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                              {question.options.map((option, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                      question.answer === index.toString() ||
                                      (question.answers &&
                                        question.answers.includes(index))
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                  <span>{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">
                      Nenhuma questão encontrada
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tente ajustar seus filtros ou adicione novas questões ao
                      banco.
                    </p>
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </main>
    </div>
  );
}
