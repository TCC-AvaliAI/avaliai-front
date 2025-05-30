"use client";

import { useState, useEffect } from "react";
import { useQuestions } from "@/hooks/useQuestions";
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
import { Plus, Trash2, GripVertical, Copy, Sparkles, Key } from "lucide-react";
import Header from "@/components/header";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
import { Exam } from "@/@types/ExamProps";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
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
import { MessageAlertProps } from "@/components/message-alert";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading/page";
import { MCQuestion } from "@/components/questions/mc-question";
import { TFQuestion } from "@/components/questions/tf-question";
import { ESQuestion } from "@/components/questions/es-question";
import { AIAssistant } from "@/components/ai-assistant";
import { Badge } from "@/components/ui/badge";

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
  apiKey: z.string().default(""),
  model: z.string().min(1, "Selecione um modelo de IA"),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

export default function CreateExamPage() {
  const params = useParams();
  const examId = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    duplicateQuestion,
    updateQuestionText,
    updateQuestionOption,
    updateQuestionPoints,
    updateQuestionAnswer,
  } = useQuestions();

  const { data: exam } = useSWR<Exam>(`/exams/${examId}`, fetcher);
  const { data: disciplines } = useSWR(`/disciplines/`, fetcher);
  const { data: classrooms } = useSWR(`/classrooms/`, fetcher);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: exam?.title || "",
      description: exam?.description || "",
      theme: exam?.theme || "",
      discipline: exam?.discipline?.id || "",
      classroom: exam?.classroom?.id || "",
      apiKey: "",
      model: "default",
    },
  });

  useEffect(() => {
    if (exam) {
      setQuestions(
        exam.questions.map((question) => ({
          ...question,
        }))
      );
      form.reset({
        title: exam.title || "",
        description: exam.description || "",
        theme: exam.theme || "",
        discipline: exam.discipline.id || "",
        classroom: exam.classroom.id || "",
        apiKey: "",
        model: "",
      });
    }
  }, [exam, form]);

  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });

  const renderQuestionEditor = (question: QuestionProps) => {
    const questionComponent = {
      MC: (
        <MCQuestion
          question={question}
          updateQuestionAnswer={updateQuestionAnswer}
          updateQuestionOption={updateQuestionOption}
          updateQuestionText={updateQuestionText}
        />
      ),
      TF: (
        <TFQuestion
          question={question}
          updateQuestionAnswer={updateQuestionAnswer}
          updateQuestionText={updateQuestionText}
        />
      ),
      ES: (
        <ESQuestion
          question={question}
          questions={questions}
          setQuestions={setQuestions}
          updateQuestionText={updateQuestionText}
        />
      ),
    };
    return questionComponent[question.type as QuestionType] || null;
  };

  async function handleDeleteQuestion(id: string) {
    try {
      await api.delete(`/questions/${id}`);
      removeQuestion(id);
      setMessageAlert({
        message: "Questão deletada com sucesso",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao deletar a questão",
        variant: "error",
      });
    }
  }

  async function handleGenerateQuestionByAI(data: ExamFormValues) {
    if (!data.theme || !data.title)
      return setMessageAlert({
        message: "Os campos tema e título são obrigatórios.",
        variant: "error",
      });
    setIsLoading(true);
    const payload = {
      description: `Crie UMA questão para a prova ${data.title} com o tema ${data.theme}`,
      model: data.model,
      api_key: data.apiKey,
    };
    try {
      const response = await api.post("/questions/ai/", {
        ...payload,
      });
      const questionByAi = response.data;
      const newQuestions = [
        {
          ...questionByAi,
          not_attached: true,
        },
        ...questions,
      ];
      setQuestions(newQuestions);
      setMessageAlert({
        message: "Questão gerada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao gerar a questão com IA.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateExam(data: ExamFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        theme: data.theme,
        discipline: data.discipline,
        classroom: data.classroom,
      };
      console.log("payload", payload);
      await api.put(`/exams/${examId}`, payload);
      setMessageAlert({
        message: "Prova gerada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao gerar a prova.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateQuestion(question: QuestionProps) {
    setIsLoading(true);
    try {
      await api.put(`/questions/${question.id}`, {
        title: question.title,
        options: question.options,
        answer: question.answer,
        answer_text: question.answer_text || String(question.answer),
        score: question.score,
        type: question.type,
      });
      setMessageAlert({
        message: "Questão atualizada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao atualizar a questão.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddQuestionToExam(id: string) {
    setIsLoading(true);
    try {
      await api.post(`/exams/${examId}/questions/`, {
        question_id: id,
      });
      const updatedQuestions = questions.map((question) => ({
        ...question,
        not_attached: false,
      }));
      setQuestions(updatedQuestions);
      setMessageAlert({
        message: "Questão anexada à prova com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao anexar a questão à prova.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header message={messageAlert} setMessage={setMessageAlert} />
        {isLoading && <Loading />}
        <main className="flex-1 container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Editar prova</h1>
          </div>
          <Form {...form}>
            <form onSubmit={() => setIsLoading(true)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }: any) => (
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
                            render={({ field }: any) => (
                              <FormItem>
                                <FormLabel>Disciplina</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={
                                          exam?.discipline.name ||
                                          "Selecione a disciplina"
                                        }
                                      />
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
                            render={({ field }: any) => (
                              <FormItem>
                                <FormLabel>Série/Turma</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={
                                          exam?.classroom.name ||
                                          "Selecione a turma"
                                        }
                                      />
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
                          render={({ field }: any) => (
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

                        <div className="flex items-center justify-between">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Descrição/Instruções</FormLabel>
                                <FormControl>
                                  <Textarea
                                    className="w-[600px]"
                                    placeholder="Instruções para a IA..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  <Sparkles className="h-4 w-4" />
                                  Modelo de IA
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o tema" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="default">
                                      Gemini (limitado)
                                    </SelectItem>
                                    <SelectItem value="gpt">
                                      Chatgpt 4o
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {form.watch("model") === "gpt" && (
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="apiKey"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel
                                    htmlFor="apiKey"
                                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                                  >
                                    <Key className="h-4 w-4" />
                                    API Key
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="password"
                                      placeholder="sk-..."
                                      className="font-mono text-sm"
                                    />
                                  </FormControl>
                                  <p className="text-xs text-gray-500">
                                    Sua API key é necessária para usar o modelo
                                    e ela não será salva por nosso sistema.
                                  </p>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        <div className="flex justify-start gap-4">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={form.handleSubmit((data: any) =>
                              handleGenerateQuestionByAI(data)
                            )}
                            disabled={!form.formState.isValid}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar questão com IA
                          </Button>
                          <Button
                            type="submit"
                            disabled={!form.formState.isValid}
                            onClick={form.handleSubmit((data: any) =>
                              handleUpdateExam(data)
                            )}
                          >
                            Salvar Prova
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {questions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`relative ${
                        question.not_attached ? "border-green-500" : ""
                      }`}
                    >
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
                                min="0"
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
                              onClick={() => handleDeleteQuestion(question.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Badge>
                              {question.was_generated_by_ai ? "IA" : "Você"}
                            </Badge>
                          </div>
                        </div>
                        {renderQuestionEditor(question)}
                        <div className="flex justify-end">
                          {question.not_attached ? (
                            <Button
                              variant="default"
                              onClick={() =>
                                handleAddQuestionToExam(question.id!)
                              }
                            >
                              Anexar à prova
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleUpdateQuestion(question)}
                            >
                              Salvar Questão
                            </Button>
                          )}
                        </div>
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
        <AIAssistant />
      </div>
    </>
  );
}
