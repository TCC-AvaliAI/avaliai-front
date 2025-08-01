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
  SquareArrowOutUpRight,
} from "lucide-react";
import Header from "@/components/header";
import { QuestionProps, QuestionType } from "@/@types/QuestionProps";
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
import api from "@/lib/axios";
import { Loading } from "@/components/loading/page";
import { MCQuestion } from "@/components/questions/mc-question";
import { TFQuestion } from "@/components/questions/tf-question";
import { ESQuestion } from "@/components/questions/es-question";
import { AIAssistant } from "@/components/ai-assistant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

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

const examFormSchema = z
  .object({
    title: z.string().min(1, "O título é obrigatório"),
    description: z.string().min(1, "A descrição é obrigatória"),
    theme: z.string().min(1, "O tema é obrigatório"),
    discipline: z.string().min(1, "Selecione uma disciplina"),
    classroom: z.string().min(1, "Selecione uma turma"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
      required_error: "Selecione a dificuldade",
    }),
    amountQuestions: z
      .string()
      .min(1, "Selecione ou digite a quantidade de questões"),
    otherAmountQuestions: z.string().optional(),
    typeQuestions: z.string().min(1, "Selecione o tipo de questões"),
    otherTypeQuestions: z.string().optional(),
    apiKey: z.string().default(""),
    model: z.string().min(1, "Selecione um modelo de IA"),
  })
  .refine(
    (data) => {
      if (data.amountQuestions === "other") {
        return !!data.otherAmountQuestions;
      }
      return true;
    },
    {
      message: "Digite a quantidade de questões",
      path: ["otherAmountQuestions"],
    }
  )
  .refine(
    (data) => {
      if (data.typeQuestions === "other") {
        return !!data.otherTypeQuestions;
      }
      return true;
    },
    {
      message: "Digite o tipo de questão",
      path: ["otherTypeQuestions"],
    }
  );

type ExamFormValues = z.infer<typeof examFormSchema>;

export default function CreateExamPage() {
  const { toast } = useToast();
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
      otherAmountQuestions: "",
      typeQuestions: "MC",
      otherTypeQuestions: "",
    },
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

  const { data: disciplines } = useSWR<DisciplineProps[]>(
    `/disciplines/`,
    fetcher
  );
  const { data: classrooms } = useSWR<ClassroomProps[]>(
    `/classrooms/`,
    fetcher
  );

  const onSubmit = async (data: ExamFormValues) => {
    return data;
  };

  async function handleGenerateExamByAI(data: ExamFormValues) {
    setIsLoading(true);
    try {
      const enhancedDescription = `
        Deve conter as seguintes características: ${
          data.otherAmountQuestions || data.amountQuestions
        } é quantidade de questões. As questões devem ser do tipo ${
        data.otherTypeQuestions || data.typeQuestions
      }, e ${data.description}`.trim();

      const payload = {
        ...data,
        description: enhancedDescription,
        model: data.model,
        api_key: data.apiKey,
      };
      const response = await api.post("/exams/ai/", { ...payload, questions });
      form.setValue("otherAmountQuestions", "");
      form.setValue("otherTypeQuestions", "");
      const exam = response.data;
      toast({
        duration: 10000,
        title: "Prova gerada com sucesso!",
        description: "Clique no ícone para visualizá-la",
        variant: "default",
        action: (
          <Button
            onClick={() => (window.location.href = `/exams/${exam.id}`)}
            variant="ghost"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
          </Button>
        ),
      });
    } catch (error) {
      setTimeout(() => {
        toast({
          duration: 10000,
          title: "Erro ao gerar a prova.",
          description: "Verifique os dados e tente novamente.",
          variant: "destructive",
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
      form.setValue("otherAmountQuestions", "");
      form.setValue("otherTypeQuestions", "");
      const exam = response.data;
      toast({
        duration: 10000,
        title: "Prova criada com sucesso!",
        description: "Clique no ícone para visualizá-la",
        variant: "default",
        action: (
          <Button
            onClick={() => (window.location.href = `/exams/${exam.id}`)}
            variant="ghost"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
          </Button>
        ),
      });
    } catch (error) {
      setTimeout(() => {
        toast({
          duration: 10000,
          title: "Erro ao gerar a prova.",
          description: "Verifique os dados e tente novamente.",
          variant: "destructive",
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
        <Header />
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
                              <FormLabel>
                                Título da Prova
                                <span className="text-red-500">*</span>
                              </FormLabel>
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
                                  <span className="text-red-500">*</span>
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
                                    {disciplines?.length ? (
                                      disciplines.map(
                                        (discipline: DisciplineProps) => (
                                          <SelectItem
                                            key={discipline.id}
                                            value={discipline.id}
                                          >
                                            {discipline.name}
                                          </SelectItem>
                                        )
                                      )
                                    ) : (
                                      <SelectItem value="unknown" disabled>
                                        Nenhuma disciplina encontrada
                                      </SelectItem>
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
                                  <span className="text-red-500">*</span>
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
                                    {classrooms?.length ? (
                                      classrooms.map(
                                        (classroom: ClassroomProps) => (
                                          <SelectItem
                                            key={classroom.id}
                                            value={classroom.id}
                                          >
                                            {classroom.name}
                                          </SelectItem>
                                        )
                                      )
                                    ) : (
                                      <SelectItem value="unknown" disabled>
                                        Nenhuma turma encontrada
                                      </SelectItem>
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
                                Tema <span className="text-red-500">*</span>
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

                          <div className="flex flex-col justify-around md:flex-row gap-8">
                            <FormField
                              control={form.control}
                              name="amountQuestions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Quantidade de questões
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
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
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="other"
                                        id="qother"
                                      />
                                      <Label htmlFor="qother">Outros:</Label>
                                      <FormField
                                        control={form.control}
                                        name="otherAmountQuestions"
                                        render={({ field }) => (
                                          <Input
                                            type="number"
                                            min="1"
                                            className="w-20 h-8"
                                            placeholder="Qtd"
                                            disabled={
                                              form.watch("amountQuestions") !==
                                              "other"
                                            }
                                            {...field}
                                            onClick={() => {
                                              const radioInput =
                                                document.getElementById(
                                                  "qother"
                                                ) as HTMLInputElement;
                                              if (radioInput)
                                                radioInput.checked = true;
                                              form.setValue(
                                                "amountQuestions",
                                                "other"
                                              );
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </RadioGroup>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="typeQuestions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Tipo das questões
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="MC" id="MC" />
                                      <Label htmlFor="MC">
                                        Multipla Escolha
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="TF" id="TF" />
                                      <Label htmlFor="TF">
                                        Verdadeiro ou Falso
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="ES" id="ES" />
                                      <Label htmlFor="ES">Discurssiva</Label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <RadioGroupItem
                                        value="other"
                                        id="qother"
                                      />
                                      <div className="flex gap-2 flex-col">
                                        <Label htmlFor="qother">
                                          Personalizado:
                                        </Label>
                                        <FormField
                                          control={form.control}
                                          name="otherTypeQuestions"
                                          render={({ field }) => (
                                            <Input
                                              type="text"
                                              className="w-60 h-8"
                                              placeholder="Ex: Discurssiva e Multipla escolha"
                                              disabled={
                                                form.watch("typeQuestions") !==
                                                "other"
                                              }
                                              {...field}
                                              onClick={() => {
                                                const radioInput =
                                                  document.getElementById(
                                                    "qother"
                                                  ) as HTMLInputElement;
                                                if (radioInput)
                                                  radioInput.checked = true;
                                                form.setValue(
                                                  "typeQuestions",
                                                  "other"
                                                );
                                              }}
                                            />
                                          )}
                                        />
                                      </div>
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
                                  <FormLabel>
                                    Dificuldade
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
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

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="mt-4 w-full">
                                <FormLabel>
                                  Descrição/Instruções
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    className="w-full max-w-full min-w-0"
                                    placeholder="A prova deve ser feita baseado no livro..."
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
                                  Escolha o modelo
                                  <span className="text-red-500">*</span>
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
                                      <Sparkles className="inline-block mr-2 h-4 w-4" />
                                      Gemini (Gratuito)
                                    </SelectItem>
                                    <SelectItem value="groq">
                                      <Image
                                        src="/groq.svg"
                                        alt="Groq"
                                        width={16}
                                        height={16}
                                        className="inline-block mr-2 h-4 w-4"
                                      />
                                      Groq (Gratuito)
                                    </SelectItem>
                                    <SelectItem value="gpt">
                                      <Image
                                        src="/gpt.svg"
                                        alt="GPT"
                                        width={16}
                                        height={16}
                                        className="inline-block mr-2 h-4 w-4"
                                      />
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
                        <div className="flex flex-col sm:flex-row justify-around gap-2 w-full">
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
              </div>
            </form>
          </Form>
        </main>
        <AIAssistant />
      </div>
    </>
  );
}
