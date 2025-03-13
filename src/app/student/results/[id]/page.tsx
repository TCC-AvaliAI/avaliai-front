import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function StudentResultsPage({ params }: any) {
  const examId = params.id;

  // Sample result data
  const result = {
    examId,
    title: "Avaliação de Matemática - 2º Bimestre",
    subject: "Matemática",
    grade: "8º Ano",
    score: 7.5,
    maxScore: 10,
    completedAt: "15/03/2025 10:45",
    duration: "48 minutos",
    questions: [
      {
        id: 1,
        text: "Qual é o valor de x na equação 2x + 5 = 15?",
        type: "multiple-choice",
        userAnswer: "0",
        correctAnswer: "0",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
      },
      {
        id: 2,
        text: "Qual é o resultado de 3² + 4²?",
        type: "multiple-choice",
        userAnswer: "1",
        correctAnswer: "1",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
      },
      {
        id: 3,
        text: "A soma dos ângulos internos de um triângulo é 180 graus.",
        type: "true-false",
        userAnswer: "0",
        correctAnswer: "0",
        isCorrect: true,
        points: 1,
        earnedPoints: 1,
      },
      {
        id: 4,
        text: "Explique o Teorema de Pitágoras e dê um exemplo de sua aplicação.",
        type: "essay",
        userAnswer:
          "O Teorema de Pitágoras estabelece que, em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos. Ou seja, a² = b² + c², onde a é a hipotenusa e b e c são os catetos. Um exemplo de aplicação é calcular a distância entre dois pontos em um plano cartesiano.",
        aiSuggestion:
          "Resposta parcialmente correta. Faltou mencionar que o teorema só se aplica a triângulos retângulos e o exemplo poderia ser mais detalhado.",
        points: 2,
        earnedPoints: 1.5,
      },
      {
        id: 5,
        text: "Quais das seguintes expressões resultam em números pares?",
        type: "checkbox",
        userAnswer: [1, 3],
        correctAnswer: [1, 3],
        isCorrect: true,
        points: 2,
        earnedPoints: 2,
      },
    ],
    feedback:
      "Bom trabalho! Você demonstrou um bom entendimento dos conceitos básicos de álgebra e geometria. Continue praticando problemas de aplicação do Teorema de Pitágoras.",
  };

  const percentageScore = (result.score / result.maxScore) * 100;

  const getScoreColor = (percentage: any) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (percentage: any) => {
    if (percentage >= 70) return "bg-green-600";
    if (percentage >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  const renderAnswerDetails = (question: any) => {
    switch (question.type) {
      case "multiple-choice":
      case "true-false":
        const options =
          question.type === "multiple-choice"
            ? ["x = 5", "x = 10", "x = 7.5", "x = 5.5"]
            : ["Verdadeiro", "Falso"];

        return (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">
              Sua resposta:
              <span
                className={
                  question.isCorrect
                    ? "text-green-600 ml-1"
                    : "text-red-600 ml-1"
                }
              >
                {options[Number.parseInt(question.userAnswer)]}
              </span>
            </p>
            {!question.isCorrect && (
              <p className="text-sm font-medium">
                Resposta correta:
                <span className="text-green-600 ml-1">
                  {options[Number.parseInt(question.correctAnswer)]}
                </span>
              </p>
            )}
          </div>
        );
      case "checkbox":
        const checkboxOptions = [
          "2n + 1, onde n é um número inteiro",
          "2n, onde n é um número inteiro",
          "n² + 1, onde n é um número ímpar",
          "n² - 1, onde n é um número par",
        ];

        return (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Suas respostas:</p>
            <ul className="list-disc pl-5 space-y-1">
              {question.userAnswer.map((idx: any) => (
                <li
                  key={idx}
                  className={
                    question.correctAnswer.includes(idx)
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {checkboxOptions[idx]}
                </li>
              ))}
            </ul>
            {!question.isCorrect && (
              <>
                <p className="text-sm font-medium">Respostas corretas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {question.correctAnswer.map((idx: any) => (
                    <li key={idx} className="text-green-600">
                      {checkboxOptions[idx]}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        );
      case "essay":
        return (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Sua resposta:</p>
            <p className="text-sm p-3 bg-muted rounded-md">
              {question.userAnswer}
            </p>
            {question.aiSuggestion && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-medium text-blue-800">
                  Feedback da IA:
                </p>
                <p className="text-sm text-blue-700">{question.aiSuggestion}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

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
          <div className="flex items-center gap-2">
            <Link href="/student">
              <Button variant="ghost" size="sm">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Resultado da Avaliação
          </h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>
              Concluído em {result.completedAt} • Duração: {result.duration}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informações</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Disciplina: {result.subject}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Turma: {result.grade}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Pontuação</h3>
                <div className="flex items-end gap-2">
                  <span
                    className={`text-4xl font-bold ${getScoreColor(
                      percentageScore
                    )}`}
                  >
                    {result.score}
                  </span>
                  <span className="text-xl text-muted-foreground">
                    / {result.maxScore}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Desempenho</span>
                    <span>{Math.round(percentageScore)}%</span>
                  </div>
                  <Progress
                    value={percentageScore}
                    className={`h-2 ${getProgressColor(percentageScore)}`}
                  />
                </div>
              </div>
            </div>

            {result.feedback && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Feedback do Professor
                </h3>
                <p className="text-sm">{result.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Detalhes das Questões
        </h2>

        {result.questions.map((question, index) => (
          <Card key={question.id} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {question.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : question.earnedPoints > 0 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      Questão {index + 1}: {question.text}
                    </h3>
                    {renderAnswerDetails(question)}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-medium ${
                      question.earnedPoints === question.points
                        ? "text-green-600"
                        : question.earnedPoints > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {question.earnedPoints} / {question.points}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center mt-8">
          <Link href="/student">
            <Button>
              Voltar ao Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
