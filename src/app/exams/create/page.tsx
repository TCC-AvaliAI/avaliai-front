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
import { Loading } from "@/components/loading/page";
import { MCQuestion } from "@/components/questions/mc-question";
import { TFQuestion } from "@/components/questions/tf-question";
import { ESQuestion } from "@/components/questions/es-question";
import { AIAssistant } from "@/components/ai-assistant";

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
    },
  });

  const [suggestedQuestion, setSuggestedQuestion] = useState<
    Partial<QuestionProps>
  >({});
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
    setIsLoading(true);
    try {
      const response = await api.post("/exams/ai/", {
        ...data,
      });
      setMessageAlert({
        message: "Prova gerada com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao gerar a prova com IA.",
        variant: "error",
      });
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

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header message={messageAlert} setMessage={setMessageAlert} />
        {isLoading && <Loading />}
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
