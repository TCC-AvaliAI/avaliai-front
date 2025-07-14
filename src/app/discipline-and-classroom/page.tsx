"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageAlert, MessageAlertProps } from "@/components/message-alert";
import { PlusCircle, School, BookOpen, RefreshCw, Trash2 } from "lucide-react";
import Header from "@/components/header";
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
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { Discipline } from "@/@types/DisciplinesProps";
import { Classroom } from "@/@types/ClassroomProps";

const disciplineSchema = z.object({
  name: z.string().min(1, "O nome da disciplina é obrigatório"),
});

const classroomSchema = z.object({
  name: z.string().min(1, "O nome da turma é obrigatório"),
  code: z.string().min(1, "O código da turma é obrigatório"),
});

type DisciplineFormValues = z.infer<typeof disciplineSchema>;
type ClassroomFormValues = z.infer<typeof classroomSchema>;

export default function ManagementPage() {
  const {
    data: disciplines,
    isLoading: isLoadingDisciplines,
    mutate: mutateDisciplines,
  } = useSWR<Discipline[]>("/disciplines/", fetcher);

  const {
    data: classrooms,
    isLoading: isLoadingClassrooms,
    mutate: mutateClassrooms,
  } = useSWR<Classroom[]>("/classrooms/", fetcher);

  const [messageAlert, setMessageAlert] = useState<MessageAlertProps>({
    message: "",
    variant: "success",
  });
  const disciplineForm = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
    },
  });
  const classroomForm = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  async function handleDeteleDiscipline(id: string) {
    try {
      await api.delete(`/disciplines/${id}`);
      setMessageAlert({
        message: "Disciplina deletada com sucesso!",
        variant: "success",
      });
      await mutateDisciplines(
        disciplines?.filter((discipline) => discipline.id !== id)
      );
    } catch (error) {
      setMessageAlert({
        message: "Erro ao deletar disciplina",
        variant: "error",
      });
    }
  }

  async function handleDeteleClassroom(id: string) {
    try {
      await api.delete(`/classrooms/${id}`);
      setMessageAlert({
        message: "Turma deletada com sucesso!",
        variant: "success",
      });
      await mutateClassrooms(
        classrooms?.filter((classroom) => classroom.id !== id)
      );
    } catch (error) {
      setMessageAlert({
        message: "Erro ao deletar turma",
        variant: "error",
      });
    }
  }

  async function handleCreateDiscipline(data: DisciplineFormValues) {
    try {
      const response = await api.post("/disciplines/", data);
      setMessageAlert({
        message: "Disciplina criada com sucesso!",
        variant: "success",
      });
      disciplines?.push(response.data);
      disciplineForm.reset();
    } catch (error) {
      setMessageAlert({
        message: "Erro ao criar disciplina",
        variant: "error",
      });
    }
  }

  async function handleCreateClassroom(data: ClassroomFormValues) {
    try {
      const response = await api.post("/classrooms/", data);
      setMessageAlert({
        message: "Turma criada com sucesso!",
        variant: "success",
      });
      classrooms?.push(response.data);
      classroomForm.reset();
    } catch (error) {
      setMessageAlert({
        message: "Erro ao criar turma",
        variant: "error",
      });
    }
  }

  function generateRandomHash(length: number = 20): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      hash += charset[array[i] % charset.length];
    }

    return hash;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header message={messageAlert} setMessage={setMessageAlert} />
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento</h1>
        </div>

        <Tabs defaultValue="disciplines" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="disciplines"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Disciplinas
            </TabsTrigger>
            <TabsTrigger value="classrooms" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Turmas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="disciplines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Disciplina</CardTitle>
                <CardDescription>
                  Crie uma nova disciplina para o sistema.
                </CardDescription>
              </CardHeader>
              <Form {...disciplineForm}>
                <form
                  onSubmit={disciplineForm.handleSubmit(handleCreateDiscipline)}
                >
                  <CardContent>
                    <FormField
                      control={disciplineForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Disciplina
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Matemática" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={disciplineForm.formState.isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {disciplineForm.formState.isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4" />
                          Criar Disciplina
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disciplinas Cadastradas</CardTitle>
                <CardDescription>
                  Lista de todas as disciplinas do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <Table className="w-full min-w-0">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-full">Nome</TableHead>
                        <TableHead className="w-[60px] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingDisciplines ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center">
                            Carregando disciplinas...
                          </TableCell>
                        </TableRow>
                      ) : disciplines && disciplines.length > 0 ? (
                        disciplines.map((discipline) => (
                          <TableRow key={discipline.id}>
                            <TableCell className="truncate">
                              {discipline.name}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  handleDeteleDiscipline(discipline.id!)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center">
                            Nenhuma disciplina cadastrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classrooms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Turma</CardTitle>
                <CardDescription>
                  Crie uma nova turma para o sistema.
                </CardDescription>
              </CardHeader>
              <Form {...classroomForm}>
                <form
                  onSubmit={classroomForm.handleSubmit(handleCreateClassroom)}
                >
                  <CardContent className="space-y-4">
                    <FormField
                      control={classroomForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome da Turma
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 3º ano do Ensino Fundamental"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={classroomForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Código da Turma</FormLabel>
                            <Button
                              variant="ghost"
                              className="mt-2"
                              onClick={() => {
                                classroomForm.setValue(
                                  "code",
                                  generateRandomHash(20)
                                );
                              }}
                            >
                              Gerar Código
                            </Button>
                          </div>
                          <FormControl>
                            <Input placeholder="Ex: 3EF2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={classroomForm.formState.isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {classroomForm.formState.isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4" />
                          Criar Turma
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turmas Cadastradas</CardTitle>
                <CardDescription>
                  Lista de todas as turmas do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Nome</TableHead>
                        <TableHead className="w-[40%]">Código</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingClassrooms ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            Carregando turmas...
                          </TableCell>
                        </TableRow>
                      ) : classrooms && classrooms.length > 0 ? (
                        classrooms.map((classroom) => (
                          <TableRow key={classroom.id}>
                            <TableCell>{classroom.name}</TableCell>
                            <TableCell>{classroom.code}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  handleDeteleClassroom(classroom.id!)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            Nenhuma turma cadastrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
