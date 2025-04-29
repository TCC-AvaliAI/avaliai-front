"use client";

import { useState } from "react";
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
import { FileText, Plus, Search, Edit, Trash2 } from "lucide-react";
import Header from "@/components/header";
import { QuestionProps } from "@/@types/QuestionProps";
import useSWR from "swr";
import { Loading } from "@/components/loading/page";
import { fetcher } from "@/lib/fetcher";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { MessageAlert, MessageAlertProps } from "@/components/message-alert";

export default function QuestionBankPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuestion, setNewQuestion] = useState<Partial<QuestionProps>>({
    title: "",
    options: ["", "", "", ""],
    answer: 0,
    answer_text: "",
    score: 1,
    type: "MC",
    user: session?.id || "",
  });
  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });

  const { data: questions, isLoading } = useSWR<QuestionProps[]>(
    `/questions/?user=${session?.id}`,
    fetcher
  );
  const filteredQuestions =
    questions?.filter((q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleNewQuestionChange = (field: keyof QuestionProps, value: any) => {
    setNewQuestion({
      ...newQuestion,
      [field]: value,
    });
  };
  const handleDeleteQuestion = async (id: string | undefined) => {
    try {
      await api.delete(`/questions/${id}`);
      setMessageAlert({
        message: "Questão excluída com sucesso!",
        variant: "success",
      });
    } catch (error) {
      setMessageAlert({
        message: "Erro ao excluir a questão.",
        variant: "error",
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions,
    });
  };

  const getQuestionTypeLabel = (type: QuestionProps["type"]) => {
    switch (type) {
      case "MC":
        return "Múltipla Escolha";
      case "TF":
        return "Verdadeiro/Falso";
      case "ES":
        return "Dissertativa";
      default:
        return type;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header message={messageAlert} setMessage={setMessageAlert} />
      {isLoading && <Loading />}
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Banco de Questões
          </h1>
          <Dialog>
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
                    onValueChange={(value: QuestionProps["type"]) =>
                      handleNewQuestionChange("type", value)
                    }
                  >
                    <SelectTrigger id="question-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MC">Múltipla Escolha</SelectItem>
                      <SelectItem value="TF">Verdadeiro/Falso</SelectItem>
                      <SelectItem value="ES">Dissertativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-title" className="text-right">
                    Pergunta
                  </Label>
                  <Textarea
                    id="question-title"
                    value={newQuestion.title}
                    onChange={(e) =>
                      handleNewQuestionChange("title", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>

                {newQuestion.type === "MC" && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">Opções</Label>
                    <div className="col-span-3 space-y-2">
                      {newQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroup
                            value={newQuestion.answer?.toString()}
                            onValueChange={(value) =>
                              handleNewQuestionChange("answer", parseInt(value))
                            }
                          >
                            <RadioGroupItem value={index.toString()} />
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
                  <Label htmlFor="question-score" className="text-right">
                    Pontuação
                  </Label>
                  <Input
                    id="question-score"
                    type="number"
                    value={newQuestion.score}
                    onChange={(e) =>
                      handleNewQuestionChange("score", parseInt(e.target.value))
                    }
                    className="col-span-3"
                  />
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
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar questões..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas as Questões</TabsTrigger>
            <TabsTrigger value="MC">Múltipla Escolha</TabsTrigger>
            <TabsTrigger value="TF">Verdadeiro/Falso</TabsTrigger>
            <TabsTrigger value="ES">Dissertativa</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {!isLoading && filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          Pontuação: {question.score}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteQuestion(question?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-medium mb-2">{question.title}</p>
                    {question.options && (
                      <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                question.answer === index
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
                    {question.type === "ES" && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Resposta: {question.answer_text}</p>
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
                  {isLoading
                    ? "Carregando questões..."
                    : "Tente ajustar seus filtros ou adicione novas questões ao banco."}
                </p>
              </div>
            )}
          </TabsContent>

          {["MC", "TF", "ES"].map((type) => (
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
                              Pontuação: {question.score}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteQuestion(question?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-medium mb-2">{question.title}</p>
                        {question.options && (
                          <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                    question.answer === index
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
                        {question.type === "ES" && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Resposta: {question.answer_text}</p>
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
                    {isLoading
                      ? "Carregando questões..."
                      : "Tente ajustar seus filtros ou adicione novas questões ao banco."}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
