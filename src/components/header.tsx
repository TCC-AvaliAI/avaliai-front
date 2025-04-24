"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

const Header = () => {
  const { data: session } = useSession();
  const userName = session?.name;
  const userAvatar = session?.image;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    try {
      await api.post("/user/logout/");
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">AvaliAi</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/exams" className="text-sm font-medium">
            Provas
          </Link>
          <Link href="/question-bank" className="text-sm font-medium">
            Banco de Questões
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline-block">
                Olá, {userName?.toLocaleLowerCase()}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
