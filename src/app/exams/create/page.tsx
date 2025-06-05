"use client";

import { useState } from "react";
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
import {
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Sparkles,
  Target,
  Users,
  BookOpen,
  FileText,
  Hash,
  Key,
} from "lucide-react";
import Header from "@/components/header";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
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
import { Loading } from "@/components/loading/page";
import { MCQuestion } from "@/components/questions/mc-question";
import { TFQuestion } from "@/components/questions/tf-question";
import { ESQuestion } from "@/components/questions/es-question";
import { AIAssistant } from "@/components/ai-assistant";
import { Exam } from "@/@types/ExamProps";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

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
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Selecione a dificuldade",
  }),
  amountQuestions: z.enum(["5", "10", "15"], {
    required_error: "Selecione a quantidade de questões",
  }),
  apiKey: z.string().default(""),
  model: z.string().min(1, "Selecione um modelo de IA"),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

export default function CreateExamPage() {
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

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      description: "",
      theme: "",
      discipline: "",
      classroom: "",
      difficulty: "MEDIUM",
      amountQuestions: "5",
      model: "default",
      apiKey: "",
    },
  });

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

  const { data: disciplines } = useSWR(`/disciplines/`, fetcher);
  const { data: classrooms } = useSWR(`/classrooms/`, fetcher);

  const onSubmit = async (data: ExamFormValues) => {
    return data;
  };

  async function handleGenerateExamByAI(data: ExamFormValues) {
    setIsLoading(true);
    try {
      const enhancedDescription = `
        Deve conter as seguintes características: ${data.amountQuestions} é quantidade de questões e ${data.description}`.trim();
      const payload = {
        ...data,
        description: enhancedDescription,
        model: data.model,
        api_key: data.apiKey,
      };
      const response = await api.post("/exams/ai/", { ...payload, questions });
      const exam = response.data;
      setTimeout(() => {
        setMessageAlert({
          message:
            "Prova gerada com sucesso! Clique no ícone para visualizá-la",
          variant: "success",
          idToRedirect: exam.id,
          redirectText: "Ver Prova",
        });
      }, 100);
    } catch (error) {
      setTimeout(() => {
        setMessageAlert({
          message: "Erro ao gerar a prova com IA.",
          variant: "error",
        });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateExam(data: ExamFormValues) {
    setIsLoading(true);
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
      const exam = response.data;
      setTimeout(() => {
        setMessageAlert({
          message:
            "Prova gerada com sucesso! Clique no ícone para visualizá-la",
          variant: "success",
          idToRedirect: exam.id,
          redirectText: "Ver Prova",
        });
      }, 100);
    } catch (error) {
      setTimeout(() => {
        setMessageAlert({
          message: "Erro ao gerar a prova.",
          variant: "error",
        });
      }, 100);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {isLoading && <Loading showText={isLoading} />}
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
                        <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                          <FileText className="w-5 h-5" />
                          Informações Básicas
                        </div>

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
                                <FormLabel>
                                  <BookOpen className="w-4 h-4" />
                                  Disciplina
                                </FormLabel>
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
                                <FormLabel>
                                  <Users className="w-4 h-4" />
                                  Série/Turma
                                </FormLabel>
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
                            <FormItem className="w-full">
                              <FormLabel>
                                <Target className="w-4 h-4 inline-block" />
                                Tema
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: prova de teoremas de álgebra"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                            <Hash className="w-5 h-5" />
                            Configurações da Prova
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                              control={form.control}
                              name="amountQuestions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantidade de questões</FormLabel>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="5" id="q5" />
                                      <Label htmlFor="q5">5 questões</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="10" id="q10" />
                                      <Label htmlFor="q10">10 questões</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="15" id="q15" />
                                      <Label htmlFor="q15">15 questões</Label>
                                    </div>
                                  </RadioGroup>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="difficulty"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dificuldade</FormLabel>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="EASY" id="d1" />
                                      <Label htmlFor="d1">Fácil</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="MEDIUM" id="d2" />
                                      <Label htmlFor="d2">Média</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="HARD" id="d3" />
                                      <Label htmlFor="d3">Difícil</Label>
                                    </div>
                                  </RadioGroup>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

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
                                  Escolher modelo de IA
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
                                      Gemini (Gratuito)
                                    </SelectItem>
                                    <SelectItem value="groq">
                                      Groq (Gratuito)
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
                            variant="default"
                            onClick={form.handleSubmit(handleGenerateExamByAI)}
                            disabled={!form.formState.isValid || isLoading}
                          >
                            {isLoading ? (
                              "Gerando..."
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar prova com IA
                              </>
                            )}
                          </Button>
                          <Button
                            type="submit"
                            variant="secondary"
                            onClick={form.handleSubmit(handleGenerateExam)}
                            disabled={!form.formState.isValid || isLoading}
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
