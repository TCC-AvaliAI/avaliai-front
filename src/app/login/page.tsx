"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("suap");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Bem-vindo ao AvaliAi</h2>
        <p className="text-center text-muted-foreground">
          Faça login para continuar e aproveite todos os recursos que temos a
          oferecer.
        </p>
        <Button className="w-full" onClick={handleLogin}>
          Entrar com SUAP
        </Button>
      </div>
    </div>
  );
}
