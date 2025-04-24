"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Database, CheckCircle } from "lucide-react";
import Header from "@/components/header";

export default function MainContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Crie e gerencie provas com inteligência artificial
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Simplifique a criação, aplicação e correção de provas com
                  nossa plataforma intuitiva e inteligente.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/link">
                  <Button size="lg" className="mt-4">
                    Começar agora
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="mt-4">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Recursos principais
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Conheça as ferramentas que tornam o AvaliAi a escolha ideal
                  para educadores.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Criação de provas</CardTitle>
                  <CardDescription>
                    Crie provas personalizadas com opções para aplicação online
                    ou impressa.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Respostas em fácil acesso</CardTitle>
                  <CardDescription>
                    A correção fica mais fácil com a visualização das respostas
                    e detalhes da prova.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Database className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Banco de questões</CardTitle>
                  <CardDescription>
                    Organize e reutilize questões por disciplina, série e nível
                    de dificuldade.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 AvaliAi. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
