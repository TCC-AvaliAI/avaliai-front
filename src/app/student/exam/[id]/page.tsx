"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"

export default function StudentExamPage() {
  const params = useParams()
  const examId = params.id

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample exam data
  const exam = {
    id: examId,
    title: "Avaliação de Matemática - 2º Bimestre",
    subject: "Matemática",
    grade: "8º Ano",
    duration: 60, // minutes
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        options: ["x = 5", "x = 10", "x = 7.5", "x = 5.5"],
        points: 1,
      },
      {
        id: 2,
        type: "multiple-choice",
        text: "Qual é o resultado de 3² + 4²?",
        options: ["7", "25", "49", "5"],
        points: 1,
      },
      {
        id: 3,
        type: "true-false",
        text: "A soma dos ângulos internos de um triângulo é 180 graus.",
        options: ["Verdadeiro", "Falso"],
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
          "2n + 1, onde n é um número inteiro",
          "2n, onde n é um número inteiro",
          "n² + 1, onde n é um número ímpar",
          "n² - 1, onde n é um número par",
        ],
        points: 2,
      },
    ],
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    })
  }

  const handleCheckboxChange = (questionId, optionIndex, checked) => {
    const currentAnswers = answers[questionId] || []
    let newAnswers

    if (checked) {
      newAnswers = [...currentAnswers, optionIndex]
    } else {
      newAnswers = currentAnswers.filter((idx) => idx !== optionIndex)
    }

    setAnswers({
      ...answers,
      [questionId]: newAnswers,
    })
  }

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      window.location.href = "/student/results/" + examId
    }, 1500)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const progress = (Object.keys(answers).length / exam.questions.length) * 100

  const renderQuestion = (question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.text}</h3>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={index.toString()} id={`q${question.id}-option-${index}`} />
                  <Label htmlFor={`q${question.id}-option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "true-false":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.text}</h3>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={index.toString()} id={`q${question.id}-option-${index}`} />
                  <Label htmlFor={`q${question.id}-option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.text}</h3>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`q${question.id}-option-${index}`}
                  checked={(answers[question.id] || []).includes(index)}
                  onCheckedChange={(checked) => handleCheckboxChange(question.id, index, checked)}
                />
                <Label htmlFor={`q${question.id}-option-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "essay":
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{question.text}</h3>
            <Textarea
              placeholder="Digite sua resposta aqui..."
              className="min-h-[200px]"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
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
            <Link href="/student" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AvaliAi</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`font-medium ${timeLeft < 300 ? "text-red-500" : ""}`}>{formatTime(timeLeft)}</span>
            </div>
            <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Finalizar Prova"}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Disciplina: {exam.subject}</p>
                <p className="text-sm text-muted-foreground">Turma: {exam.grade}</p>
                <p className="text-sm text-muted-foreground">Duração: {exam.duration} minutos</p>
              </div>
              <div className="space-y-2 min-w-[200px]">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                Não feche ou atualize esta página. Suas respostas serão perdidas.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Questão {currentQuestion + 1} de {exam.questions.length}
              </h2>
              <p className="text-sm text-muted-foreground">
                {exam.questions[currentQuestion].points}{" "}
                {exam.questions[currentQuestion].points === 1 ? "ponto" : "pontos"}
              </p>
            </div>

            {renderQuestion(exam.questions[currentQuestion])}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Anterior
            </Button>
            <div className="flex gap-2">
              {currentQuestion === exam.questions.length - 1 ? (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Finalizar"}
                </Button>
              ) : (
                <Button onClick={handleNext}>Próxima</Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {exam.questions.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : answers[index + 1] ? "outline" : "ghost"}
              className={`h-10 w-10 p-0 ${answers[index + 1] ? "border-primary" : ""}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </main>
    </div>
  )
}

