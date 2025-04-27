"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, GripVertical, Copy } from "lucide-react";
import Header from "@/components/header";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
import { Exam } from "@/@types/ExamProps";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { MessageAlertProps } from "@/components/message-alert";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type DifficultyLevel = "easy" | "medium" | "hard";

type DisciplineProps = {
  id: string;
  name: string;
  user: string;
};
type ClassroomProps = {
  id: string;
  code: string;
  name: string;
  user: string;
};

const examFormSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  theme: z.string().min(1, "O tema é obrigatório"),
  discipline: z.string().min(1, "Selecione uma disciplina"),
  classroom: z.string().min(1, "Selecione uma turma"),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

export default function CreateExamPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      description: "",
      theme: "",
      discipline: "",
      classroom: "",
    },
  });

  const [suggestedQuestion, setSuggestedQuestion] = useState<
    Partial<QuestionProps>
  >({});
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });
  const [examInfo, setExamInfo] = useState<Exam>({
    id: "",
    user: "",
    title: "",
    duration: 0,
    score: 0,
    created_at: "",
    applied_at: "",
    qr_code: "",
    description: "",
    theme: "",
    was_generated_by_ai: false,
    difficulty: "medium",
    status: "Pendente",
    discipline: "",
    classroom: "",
    questions: [],
  });

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuestionProps = {
      id: uuidv4(),
      title: "",
      score: 10,
      answer_text: "",
      created_at: "",
      user: "",
      answer: 0,
      options: [],
      type,
    };

    if (type === "MC") {
      newQuestion.options = ["", "", "", ""];
    } else if (type === "TF") {
      newQuestion.options = ["Verdadeiro", "Falso"];
    }
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: String(questions.length + 1),
      };
      setQuestions([...questions, newQuestion]);
    }
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, title: text } : q))
    );
  };

  const updateQuestionOption = (
    id: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updatedOptions = [...q.options];
          updatedOptions[optionIndex] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const updateQuestionPoints = (id: string, points: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, score: Number.parseInt(points) || 1 } : q
      )
    );
  };

  const updateQuestionAnswer = (id: string, answer: number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const renderQuestionEditor = (question: QuestionProps) => {
    switch (question.type) {
      case "MC":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Opções</Label>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroup
                    value={String(question.answer)}
                    onValueChange={(value) =>
                      updateQuestionAnswer(question.id!, parseInt(value))
                    }
                  >
                    <RadioGroupItem
                      value={String(index)}
                      id={`q${question.id}-option-${index}`}
                    />
                  </RadioGroup>
                  <Input
                    placeholder={`Opção ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateQuestionOption(question.id!, index, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "TF":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Afirmação</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a afirmação aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Resposta correta</Label>
              <RadioGroup
                value={String(question.answer)}
                onValueChange={(value) =>
                  updateQuestionAnswer(question.id!, parseInt(value))
                }
                className="flex space-x-4"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={String(index)}
                      id={`q${question.id}-option-${index}`}
                    />
                    <Label htmlFor={`q${question.id}-option-${index}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );
      case "ES":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-text`}>Pergunta</Label>
              <Textarea
                id={`question-${question.id}-text`}
                placeholder="Digite a pergunta aqui..."
                value={question.title}
                onChange={(e) =>
                  updateQuestionText(question.id!, e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-answer`}>
                Resposta esperada (para correção)
              </Label>
              <Textarea
                id={`question-${question.id}-answer`}
                placeholder="Digite a resposta esperada aqui..."
                value={question.answer_text}
                onChange={(e) =>
                  setQuestions(
                    questions.map((q) =>
                      q.id === question.id
                        ? { ...q, answer_text: e.target.value }
                        : q
                    )
                  )
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const { data: disciplines } = useSWR(
    `/disciplines/?user=${session?.id}`,
    fetcher
  );
  const { data: classrooms } = useSWR(
    `/classrooms/?user=${session?.id}`,
    fetcher
  );

  const onSubmit = async (data: ExamFormValues) => {
    try {
      console.log(data);
      toast({
        title: "Sucesso!",
        description: "Formulário validado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao processar o formulário.",
        variant: "destructive",
      });
    }
  };

  async function handleGenerateExamByAI(data: ExamFormValues) {
    try {
      const response = await api.post("/exams/ai/", {
        ...data,
      });
      console.log(response.data);
      setMessageAlert({
        message: "Prova gerada com sucesso!",
        variant: "success",
      });
      router.push(`/exams/${response.data.id}`);
    } catch (error) {
      setMessageAlert({
        message: "Erro ao gerar a prova com IA.",
        variant: "error",
      });
    }
  }

  async function handleGenerateExam(data: ExamFormValues) {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        theme: data.theme,
        discipline: data.discipline,
        classroom: data.classroom,
        questions:
          questions.length > 0
            ? questions.map((q) => ({
                title: q.title,
                options: q.options,
                answer: q.answer,
                answer_text: q.answer_text || String(q.answer),
                score: q.score,
                type: q.type,
              }))
            : undefined,
      };

      const response = await api.post("/exams/", payload);
      setMessageAlert({
        message: "Prova gerada com sucesso!",
        variant: "success",
      });
      router.push(`/exams/${response.data.id}`);
    } catch (error) {
      setMessageAlert({
        message: "Erro ao gerar a prova.",
        variant: "error",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header message={messageAlert} setMessage={setMessageAlert} />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Criar Nova Prova
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título da Prova</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: Avaliação de Matemática - 2º Bimestre"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discipline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Disciplina</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a disciplina" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {disciplines?.map(
                                    (discipline: DisciplineProps) => (
                                      <SelectItem
                                        key={discipline.id}
                                        value={discipline.id}
                                      >
                                        {discipline.name}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="classroom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Série/Turma</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a turma" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classrooms?.map(
                                    (classroom: ClassroomProps) => (
                                      <SelectItem
                                        key={classroom.id}
                                        value={classroom.id}
                                      >
                                        {classroom.name}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tema</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Escreva aqui o tema da prova..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição/Instruções</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Instruções para os alunos..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-start gap-4">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={form.handleSubmit((data) =>
                            handleGenerateExamByAI(data)
                          )}
                          disabled={!form.formState.isValid}
                        >
                          Gerar prova com IA
                        </Button>
                        <Button
                          type="submit"
                          disabled={!form.formState.isValid}
                          onClick={form.handleSubmit((data) =>
                            handleGenerateExam(data)
                          )}
                        >
                          Salvar Prova
                        </Button>
                      </div>
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
                            <Label
                              htmlFor={`question-${question.id}-points`}
                              className="text-sm"
                            >
                              Pontos:
                            </Label>
                            <Input
                              id={`question-${question.id}-points`}
                              type="number"
                              min="1"
                              className="w-16 h-8"
                              value={question.score}
                              onChange={(e) =>
                                updateQuestionPoints(
                                  question.id!,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateQuestion(question.id!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id!)}
                          >
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
                    <CardContent className="justify-center items-center">
                      <div className="flex justify-around">
                        <Button
                          variant="outline"
                          onClick={() => addQuestion("MC")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Múltipla Escolha
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addQuestion("TF")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Verdadeiro/Falso
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addQuestion("ES")}
                        >
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
                    {suggestedQuestion.title ? (
                      <div className="flex items-center justify-between mb-4">
                        <h3>{suggestedQuestion.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setQuestions([
                                ...questions,
                                suggestedQuestion as QuestionProps,
                              ]);
                              setSuggestedQuestion({
                                type: "TF",
                                title: "",
                                options: [],
                                answer: 0,
                                score: 0,
                                answer_text: "",
                                created_at: "",
                                user: "",
                              });
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSuggestedQuestion({})}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          Nenhuma sugestão disponível.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Resumo da Prova</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total de questões:</span>
                        <span className="text-sm font-medium">
                          {questions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pontuação total:</span>
                        <span className="text-sm font-medium">
                          {questions.reduce(
                            (sum, q) => sum + (q.score || 1),
                            0
                          )}{" "}
                          pontos
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
