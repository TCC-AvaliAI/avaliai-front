"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Save,
  Download,
  QrCode,
  ChevronLeft,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Definição dos tipos
type QuestionType = "multiple-choice" | "true-false" | "checkbox" | "essay"
type DifficultyLevel = "easy" | "medium" | "hard"
type ExamStatus = "draft" | "scheduled" | "active" | "completed" | "archived"

interface Option {
  id: number
  text: string
}

interface Question {
  id: number
  type: QuestionType
  text: string
  options?: Option[]
  answer?: string
  answers?: number[]
  maxLength?: number
  points: number
}

interface ExamInfo {
  id: string
  title: string
  subject: string
  grade: string
  difficulty: DifficultyLevel
  isOnline: boolean
  description: string
  duration: number
  status: ExamStatus
  createdAt: string
  updatedAt: string
  scheduledFor?: string
}

interface SuggestedQuestion {
  id: number
  text: string
  type: QuestionType
  difficulty: DifficultyLevel
  subject: string
}

export default function EditExamPage() {
  const params = useParams()
  const examId = params.id as string

  // Dados simulados para sugestões de questões
  const suggestedQuestions: Record<DifficultyLevel, SuggestedQuestion[]> = {
    easy: [
      { id: 1, text: "Qual é a capital do Brasil?", type: "multiple-choice", difficulty: "easy", subject: "Geografia" },
      { id: 2, text: "Quanto é 2 + 2?", type: "multiple-choice", difficulty: "easy", subject: "Matemática" },
      {
        id: 3,
        text: "A água ferve a 100°C ao nível do mar.",
        type: "true-false",
        difficulty: "easy",
        subject: "Ciências",
      },
    ],
    medium: [
      {
        id: 4,
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        type: "multiple-choice",
        difficulty: "medium",
        subject: "Matemática",
      },
      {
        id: 5,
        text: "Quais são os estados físicos da matéria?",
        type: "checkbox",
        difficulty: "medium",
        subject: "Ciências",
      },
      { id: 6, text: "Explique o processo de fotossíntese.", type: "essay", difficulty: "medium", subject: "Biologia" },
    ],
    hard: [
      { id: 7, text: "Resolva a integral ∫(x²+2x+1)dx", type: "essay", difficulty: "hard", subject: "Matemática" },
      {
        id: 8,
        text: "Explique o princípio da incerteza de Heisenberg.",
        type: "essay",
        difficulty: "hard",
        subject: "Física",
      },
      {
        id: 9,
        text: "Quais dos seguintes compostos são ácidos fortes?",
        type: "checkbox",
        difficulty: "hard",
        subject: "Química",
      },
    ],
  }

  // Estado para armazenar os dados do exame
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    id: examId,
    title: "Avaliação de Matemática - 2º Bimestre",
    subject: "Matemática",
    grade: "8º Ano",
    difficulty: "medium",
    isOnline: true,
    description: "Avaliação sobre álgebra, geometria e resolução de problemas matemáticos.",
    duration: 60,
    status: "draft",
    createdAt: "10/03/2025",
    updatedAt: "12/03/2025",
  })

  // Estado para armazenar as questões
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "multiple-choice",
      text: "Qual é o valor de x na equação 2x + 5 = 15?",
      options: [
        { id: 1, text: "x = 5" },
        { id: 2, text: "x = 10" },
        { id: 3, text: "x = 7.5" },
        { id: 4, text: "x = 5.5" },
      ],
      answer: "1",
      points: 1,
    },
    {
      id: 2,
      type: "multiple-choice",
      text: "Qual é o resultado de 3² + 4²?",
      options: [
        { id: 1, text: "7" },
        { id: 2, text: "25" },
        { id: 3, text: "49" },
        { id: 4, text: "5" },
      ],
      answer: "2",
      points: 1,
    },
    {
      id: 3,
      type: "true-false",
      text: "A soma dos ângulos internos de um triângulo é 180 graus.",
      options: [
        { id: 1, text: "Verdadeiro" },
        { id: 2, text: "Falso" },
      ],
      answer: "1",
      points: 1,
    },
    {
      id: 4,
      type: "essay",
      text: "Explique o Teorema de Pitágoras e dê um exemplo de sua aplicação.",
      points: 2,
    },
    {
      id: 5,
      type: "checkbox",
      text: "Quais das seguintes expressões resultam em números pares?",
      options: [
        { id: 1, text: "2n + 1, onde n é um número inteiro" },
        { id: 2, text: "2n, onde n é um número inteiro" },
        { id: 3, text: "n² + 1, onde n é um número ímpar" },
        { id: 4, text: "n² - 1, onde n é um número par" },
      ],
      answers: [2, 4],
      points: 2,
    },
  ])

  // Estado para controlar se houve alterações não salvas
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Atualizar o estado de alterações não salvas quando houver mudanças
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [examInfo, questions])

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      text: "",
      points: 1,
    }

    if (type === "multiple-choice") {
      newQuestion.options = [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ]
      newQuestion.answer = ""
    } else if (type === "true-false") {
      newQuestion.options = [
        { id: 1, text: "Verdadeiro" },
        { id: 2, text: "Falso" },
      ]
      newQuestion.answer = ""
    } else if (type === "checkbox") {
      newQuestion.options = [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" },
      ]
      newQuestion.answers = []
    } else if (type === "essay") {
      newQuestion.answer = ""
      newQuestion.maxLength = 500
    }

    setQuestions([...questions, newQuestion])
  }

  const addSuggestedQuestion = (question: SuggestedQuestion) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: question.type,
      text: question.text,
      points: 1,
    }

    if (question.type === "multiple-choice") {
      newQuestion.options = [
        { id: 1, text: "Opção 1" },
        { id: 2, text: "Opção 2" },
        { id: 3, text: "Opção 3" },
        { id: 4, text: "Opção 4" },
      ]
      newQuestion.answer = ""
    } else if (question.type === "true-false") {
      newQuestion.options = [
        { id: 1, text: "Verdadeiro" },
        { id: 2, text: "Falso" },
      ]
      newQuestion.answer = ""
    } else if (question.type === "checkbox") {
      newQuestion.options = [
        { id: 1, text: "Opção 1" },
        { id: 2, text: "Opção 2" },
        { id: 3, text: "Opção 3" },
        { id: 4, text: "Opção 4" },
      ]
      newQuestion.answers = []
    } else if (question.type === "essay") {
      newQuestion.answer = ""
      newQuestion.maxLength = 500
    }

    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const duplicateQuestion = (id: number) => {
    const questionToDuplicate = questions.find((q) => q.id === id)
    if (questionToDuplicate) {
      const newQuestion = { ...questionToDuplicate, id: questions.length + 1 }
      setQuestions([...questions, newQuestion])
    }
  }

  const updateQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)))
  }

  const updateQuestionOption = (id: number, optionId: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id && q.options) {
          const newOptions = q.options.map((opt) => (opt.id === optionId ? { ...opt, text: value } : opt))
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const updateQuestionPoints = (id: number, points: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, points: Number.parseInt(points) || 1 } : q)))
  }

  const updateQuestionAnswer = (id: number, answer: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)))
  }

  const updateQuestionCheckboxAnswer = (id: number, optionId: number, checked: boolean) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          let newAnswers = q.answers || []
          if (checked) {
            newAnswers = [...newAnswers, optionId]
          } else {
            newAnswers = newAnswers.filter((a) => a !== optionId)
          }
          return { ...q, answers: newAnswers }
        }
        return q
      }),
    )
  }

  const handleSave = () => {
    // Simulação de salvamento
    setHasUnsavedChanges(false)
    // Atualizar a data de atualização
    setExamInfo({
      ...examInfo,
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    })
    // Aqui seria feita a chamada para a API para salvar os dados
    alert("Prova salva com sucesso!")
  }

  const renderQuestionEditor = (question: Question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) => updateQuestionText(question.id, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Opções</Label>
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <RadioGroup
                    value={question.answer || ""}
                    onValueChange={(value) => updateQuestionAnswer(question.id, value)}
                  >
                    <RadioGroupItem value={option.id.toString()} id={`q${question.id}-option-${option.id}`} />
                  </RadioGroup>
                  <Input
                    placeholder={`Opção ${option.id}`}
                    value={option.text}
                    onChange={(e) => updateQuestionOption(question.id, option.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      case "true-false":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Afirmação</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a afirmação aqui..."
                value={question.text}
                onChange={(e) => updateQuestionText(question.id, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Resposta correta</Label>
              <RadioGroup
                value={question.answer || ""}
                onValueChange={(value) => updateQuestionAnswer(question.id, value)}
                className="flex space-x-4"
              >
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id.toString()} id={`q${question.id}-option-${option.id}`} />
                    <Label htmlFor={`q${question.id}-option-${option.id}`}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) => updateQuestionText(question.id, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Opções (marque as corretas)</Label>
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`q${question.id}-option-${option.id}`}
                    checked={(question.answers || []).includes(option.id)}
                    onCheckedChange={(checked) =>
                      updateQuestionCheckboxAnswer(question.id, option.id, checked === true)
                    }
                  />
                  <Input
                    placeholder={`Opção ${option.id}`}
                    value={option.text}
                    onChange={(e) => updateQuestionOption(question.id, option.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      case "essay":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.text}
                onChange={(e) => updateQuestionText(question.id, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-answer`}>Resposta esperada (para correção)</Label>
              <Textarea
                id={`question-${question.id}-answer`}
                placeholder="Digite a resposta esperada aqui..."
                value={question.answer || ""}
                onChange={(e) => updateQuestionAnswer(question.id, e.target.value)}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Gerar QR Code
            </Button>
            <Link href={`/exams/${examId}`}>
              <Button size="sm">Finalizar</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/exams/${examId}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Editar Prova</h1>
        </div>

        {hasUnsavedChanges && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Alterações não salvas</AlertTitle>
            <AlertDescription>
              Você tem alterações não salvas. Clique em "Salvar" para manter suas alterações.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-title">Título da Prova</Label>
                    <Input
                      id="exam-title"
                      placeholder="Ex: Avaliação de Matemática - 2º Bimestre"
                      value={examInfo.title}
                      onChange={(e) => setExamInfo({ ...examInfo, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-subject">Disciplina</Label>
                      <Input
                        id="exam-subject"
                        placeholder="Ex: Matemática"
                        value={examInfo.subject}
                        onChange={(e) => setExamInfo({ ...examInfo, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-grade">Série/Turma</Label>
                      <Input
                        id="exam-grade"
                        placeholder="Ex: 2º Ano - Turma A"
                        value={examInfo.grade}
                        onChange={(e) => setExamInfo({ ...examInfo, grade: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-difficulty">Nível de Dificuldade</Label>
                      <Select
                        value={examInfo.difficulty}
                        onValueChange={(value: DifficultyLevel) => setExamInfo({ ...examInfo, difficulty: value })}
                      >
                        <SelectTrigger id="exam-difficulty">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-duration">Duração (minutos)</Label>
                      <Input
                        id="exam-duration"
                        type="number"
                        min="1"
                        value={examInfo.duration}
                        onChange={(e) => setExamInfo({ ...examInfo, duration: Number.parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="exam-online"
                        checked={examInfo.isOnline}
                        onCheckedChange={(checked) => setExamInfo({ ...examInfo, isOnline: checked })}
                      />
                      <Label htmlFor="exam-online">Prova Online</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {examInfo.isOnline
                        ? "A prova será aplicada online e as respostas serão coletadas digitalmente."
                        : "A prova será impressa para aplicação presencial."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-description">Descrição/Instruções</Label>
                    <Textarea
                      id="exam-description"
                      placeholder="Instruções para os alunos..."
                      value={examInfo.description}
                      onChange={(e) => setExamInfo({ ...examInfo, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-status">Status</Label>
                    <Select
                      value={examInfo.status}
                      onValueChange={(value: ExamStatus) => setExamInfo({ ...examInfo, status: value })}
                    >
                      <SelectTrigger id="exam-status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="scheduled">Agendada</SelectItem>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                        <SelectItem value="archived">Arquivada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {examInfo.status === "scheduled" && (
                    <div className="space-y-2">
                      <Label htmlFor="exam-scheduled-for">Data Agendada</Label>
                      <Input
                        id="exam-scheduled-for"
                        type="date"
                        value={
                          examInfo.scheduledFor
                            ? new Date(examInfo.scheduledFor.split("/").reverse().join("-")).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null
                          setExamInfo({
                            ...examInfo,
                            scheduledFor: date ? date.toLocaleDateString("pt-BR") : undefined,
                          })
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {questions.map((question, index) => (
              <Card key={question.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <h3 className="font-medium">Questão {index + 1}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`question-${question.id}-points`} className="text-sm">
                          Pontos:
                        </Label>
                        <Input
                          id={`question-${question.id}-points`}
                          type="number"
                          min="1"
                          className="w-16 h-8"
                          value={question.points}
                          onChange={(e) => updateQuestionPoints(question.id, e.target.value)}
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => duplicateQuestion(question.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {renderQuestionEditor(question)}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center">
              <Card className="w-full">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" onClick={() => addQuestion("multiple-choice")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Múltipla Escolha
                    </Button>
                    <Button variant="outline" onClick={() => addQuestion("true-false")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Verdadeiro/Falso
                    </Button>
                    <Button variant="outline" onClick={() => addQuestion("checkbox")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Caixas de Seleção
                    </Button>
                    <Button variant="outline" onClick={() => addQuestion("essay")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Dissertativa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Sugestões de Questões</h3>
                <Tabs defaultValue={examInfo.difficulty}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="easy">Fácil</TabsTrigger>
                    <TabsTrigger value="medium">Médio</TabsTrigger>
                    <TabsTrigger value="hard">Difícil</TabsTrigger>
                  </TabsList>
                  {Object.entries(suggestedQuestions).map(([difficulty, questions]) => (
                    <TabsContent key={difficulty} value={difficulty} className="space-y-4 mt-4">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => addSuggestedQuestion(question)}
                        >
                          <p className="font-medium text-sm">
                            {question.subject}: {question.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Tipo:{" "}
                            {question.type === "multiple-choice"
                              ? "Múltipla Escolha"
                              : question.type === "true-false"
                                ? "Verdadeiro/Falso"
                                : question.type === "checkbox"
                                  ? "Caixas de Seleção"
                                  : "Dissertativa"}
                          </p>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Resumo da Prova</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de questões:</span>
                    <span className="text-sm font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pontuação total:</span>
                    <span className="text-sm font-medium">
                      {questions.reduce((sum, q) => sum + (q.points || 1), 0)} pontos
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duração estimada:</span>
                    <span className="text-sm font-medium">{examInfo.duration} minutos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Modo:</span>
                    <span className="text-sm font-medium">{examInfo.isOnline ? "Online" : "Impresso"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <span className="text-sm font-medium">
                      {examInfo.status === "draft"
                        ? "Rascunho"
                        : examInfo.status === "scheduled"
                          ? "Agendada"
                          : examInfo.status === "active"
                            ? "Ativa"
                            : examInfo.status === "completed"
                              ? "Concluída"
                              : "Arquivada"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Última atualização:</span>
                    <span className="text-sm font-medium">{examInfo.updatedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
